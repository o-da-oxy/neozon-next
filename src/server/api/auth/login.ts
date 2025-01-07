import { z } from 'zod';
import { db } from '~/server/db';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function login(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const parsedBody = loginSchema.parse(body);
    const { email, password } = parsedBody;

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = sign(
      {
        userId: user.id,
        email: user.email,
      },
      'your_random_long_secret_key_here_1234567890',
      {
        expiresIn: '1h',
      },
    );

    return new Response(JSON.stringify({ message: 'Logged in successfully', token }), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ZodError') {
      return new Response(JSON.stringify({ message: error.issues[0].message }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
