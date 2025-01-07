import { db } from '~/server/db';
import { carts, orders } from '~/server/db/schema';
import { verify } from 'jsonwebtoken';
import { sql } from 'drizzle-orm';

export default async function ordersHandler(req: Request): Promise<Response> {
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

    if (req.method === 'POST') {
      const cartItems = await db.query.carts.findMany({
        where: (carts, { eq, and }) => and(eq(carts.userId, userId), eq(carts.status, 'in_cart')),
      });

      if (cartItems.length === 0) {
        return new Response(JSON.stringify({ message: 'Корзина пуста' }), { status: 400 });
      }

      for (const item of cartItems) {
        await db.insert(orders).values({
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      await db
        .delete(carts)
        .where(sql`${carts.userId} = ${userId} AND ${carts.status} = 'in_cart'`);

      return new Response(JSON.stringify({ message: 'Заказ оформлен' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
