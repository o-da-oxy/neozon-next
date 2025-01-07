import updateOrderHandler from '~/server/api/management/updateOrder';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  return await updateOrderHandler(req, id);
}
