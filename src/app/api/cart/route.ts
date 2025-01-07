import cartHandler from '~/server/api/cart/cart';

export async function GET(req: Request) {
  return await cartHandler(req);
}

export async function POST(req: Request) {
  return await cartHandler(req);
}
