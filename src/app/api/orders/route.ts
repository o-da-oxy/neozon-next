import ordersHandler from '~/server/api/orders/orders';

export async function POST(req: Request) {
  return await ordersHandler(req);
}
