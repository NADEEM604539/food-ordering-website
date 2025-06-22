// app/dashboard/route.js
import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  const role = await store.get('role')?.value;
  const login =  await store.get('login')?.value;

  if (role && login) {
    return Response.json({ role, login});
  }

  return Response.json({ error: 'unauthorized' }, { status: 401 });
}
