import pool from '@/lib/db';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ── Lookup user ─────────────────────────────────────────────
    const [users] = await pool.query(
      'SELECT id, password_hash, role_id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    const user = users[0];

    // ── Plain-text password check (replace with bcrypt asap) ───
    if (password !== user.password_hash) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // ── Resolve role name ───────────────────────────────────────
    const [roles] = await pool.query(
      'SELECT role_name FROM roles WHERE id = ? LIMIT 1',
      [user.role_id]
    );
    const role = roles.length ? roles[0].role_name : null;

    // ── Set cookies for later pages ─────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set('role',  role, );
    cookieStore.set('email', email,);
    cookieStore.set('login', 'true');

    // ── Respond to client ───────────────────────────────────────
    return Response.json({ userId: user.id, role });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
