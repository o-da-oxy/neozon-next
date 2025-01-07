import ordersHandler from '~/server/api/management/orders';

export async function GET(req: Request) {
  return await ordersHandler(req);
}
