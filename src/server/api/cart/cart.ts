import { db } from '~/server/db';
import { carts, orderStatus } from '~/server/db/schema';
import { verify } from 'jsonwebtoken';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

const addToCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export default async function cartHandler(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  try {
    const token = authHeader.substring(7);
    const decoded = verify(token, 'your_random_long_secret_key_here_1234567890') as {
      userId: string;
    };
    const userId = decoded.userId;

    if (req.method === 'GET') {
      const cartItems = await db.query.carts.findMany({
        where: (carts, { eq, and }) => and(eq(carts.userId, userId), eq(carts.status, 'in_cart')),
      });

      return new Response(JSON.stringify(cartItems), { status: 200 });
    }
    if (req.method === 'POST') {
      const body = await req.json();
      const parsedBody = addToCartSchema.parse(body);

      const { productId, quantity } = parsedBody;

      await db
        .insert(carts)
        .values({
          productId,
          quantity,
          userId,
          status: 'in_cart',
        })
        .onConflictDoUpdate({
          target: [carts.userId, carts.productId],
          set: {
            quantity: sql`${carts.quantity} + ${quantity}`,
            updatedAt: new Date(),
            status: 'in_cart',
          },
        });
      return new Response(JSON.stringify({ message: 'Product added to cart' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  } catch (error) {
    console.error(error);
    if (error.name === 'ZodError') {
      return new Response(JSON.stringify({ message: error.issues[0].message }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
