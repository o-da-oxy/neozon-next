import login from '~/server/api/auth/login';

export async function POST(req: Request) {
  console.log('login request');
  return await login(req);
}
