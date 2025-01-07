import { db } from '~/server/db';
import { orders } from '~/server/db/schema';
import { verify } from 'jsonwebtoken';

export default async function ordersHandler(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = verify(token, 'your_random_long_secret_key_here_1234567890') as {
      userId: string;
      email: string;
    };

    if (decoded.email !== 'admin@mail.ru') {
      return new Response(JSON.stringify({ message: 'Доступ запрещен' }), { status: 403 });
    }

    if (req.method === 'GET') {
      const allOrders = await db.query.orders.findMany();
      return new Response(JSON.stringify(allOrders), { status: 200 });
    }
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
