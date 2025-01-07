import { db } from '~/server/db';
import { verify } from 'jsonwebtoken';

export default async function myOrdersHandler(req: Request): Promise<Response> {
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
      const userOrders = await db.query.orders.findMany({
        where: (orders, { eq }) => eq(orders.userId, userId),
        orderBy: (orders, { desc }) => desc(orders.createdAt),
      });

      return new Response(JSON.stringify(userOrders), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
