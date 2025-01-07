import { db } from '~/server/db';
import { verify, TokenExpiredError, sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export default async function me(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization');
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = verify(token, 'your_random_long_secret_key_here_1234567890') as {
      userId: string;
    };

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, decoded.userId),
    });
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const newToken = sign(
      {
        userId: user.id,
        email: user.email,
      },
      'your_random_long_secret_key_here_1234567890',
      { expiresIn: '1h' },
    );
    return NextResponse.json({ user, token: newToken }, { status: 200 });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return NextResponse.json({ message: 'Token Expired' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
