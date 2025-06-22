import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete('role');
  cookieStore.delete('email');
  cookieStore.delete('login');

  return new Response(JSON.stringify({ message: 'Logout successful' }), {
    status: 200,
  });
}
