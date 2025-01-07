import myOrdersHandler from '~/server/api/orders/my';

export async function GET(req: Request) {
  return await myOrdersHandler(req);
}
