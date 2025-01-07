import { db } from '~/server/db';
import { orders } from '~/server/db/schema';
import { verify } from 'jsonwebtoken';
import { sql } from 'drizzle-orm';

export default async function updateOrderHandler(req: Request, orderId: string): Promise<Response> {
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
    if (req.method !== 'PUT') {
      return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
    }

    const { status } = await req.json();

    if (!['placed', 'shipped', 'delivered'].includes(status)) {
      return new Response(JSON.stringify({ message: 'Invalid status' }), { status: 400 });
    }

    await db
      .update(orders)
      .set({ status })
      .where(sql`${orders.id} = ${orderId}`);

    return new Response(JSON.stringify({ message: 'Статус заказа изменен' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
