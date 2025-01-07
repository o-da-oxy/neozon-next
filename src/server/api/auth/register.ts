import { z } from 'zod';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { hash } from 'bcrypt';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function register(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const parsedBody = registerSchema.parse(body);
    const { email, password } = parsedBody;

    const hashedPassword = await hash(password, 10);

    const newUser = await db.insert(users).values({ email, password: hashedPassword }).returning();

    return new Response(JSON.stringify({ message: 'User created', user: newUser }), {
      status: 201,
    });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ZodError') {
      return new Response(JSON.stringify({ message: error.issues[0].message }), { status: 400 });
    }
    if (error.message.includes('duplicate key value violates unique constraint')) {
      return new Response(JSON.stringify({ message: 'User with this email already exists' }), {
        status: 409,
      });
    }
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
