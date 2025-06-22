import { NextResponse } from 'next/server';
import  db  from '@/lib/db'; // your DB connection
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { name, email } = await req.json();
    const emailCookie = cookies().get('email')?.value;

    if (!emailCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.query('UPDATE users SET name = ?, email = ? WHERE email = ?', [name, email, emailCookie]);

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
