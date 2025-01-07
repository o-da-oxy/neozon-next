import me from '~/server/api/auth/me';

export async function GET(req: Request) {
  console.log('me request');
  return await me(req);
}
