import register from '~/server/api/auth/register';

export async function POST(req: Request) {
  console.log('register request');
  return await register(req);
}
