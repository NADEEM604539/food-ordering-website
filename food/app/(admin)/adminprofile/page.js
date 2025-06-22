'use client';

import { useEffect, useState } from 'react';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const [admin, setAdmin]   = useState(null);
  const [form,  setForm]    = useState({ name: '', password: '' });
  const [msg,   setMsg]     = useState('');
  const [load,  setLoad]    = useState(true);

  const router = useRouter();
  
     useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');

        const { role, login } = await res.json();

        console.log('Role:', role);
        console.log('Login:', login);

        // Redirect if not admin or not logged in
        if (role !== 'admin' || login !== 'true') {
          router.push('/not-found');
        }

      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/not-found'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 
  /* ── Fetch profile once ───────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/admin/profile');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        setAdmin(data.admin);
        setForm({ name: data.admin.name, password: '' });
      } catch (err) { setMsg(`❌ ${err.message}`); }
      finally       { setLoad(false); }
    })();
  }, []);

  /* ── Update profile ──────────────────────────────── */
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res  = await fetch('/api/admin/profile', {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setAdmin(prev => ({ ...prev, name: form.name }));
      setForm({ ...form, password: '' });
      setMsg('✅ Profile updated');
    } catch (err) { setMsg(`❌ ${err.message}`); }
  };

  /* UI */
  if (load)        return <Screen>Loading profile…</Screen>;
  if (!admin)      return <Screen isError>{msg}</Screen>;

  return (
     <div>
            <Anavbar/>
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] px-6 py-10 text-gray-200">
      <div className="max-w-3xl mx-auto bg-[#1e1e2f] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-orange-900 to-purple-900 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">👑 Admin Profile</h1>
          <p className="text-white/80 text-sm mt-1">Manage your credentials</p>
        </header>

        {/* Details */}
        <section className="p-8 grid gap-6">
          <Detail label="Email"        value={admin.email} />
          <Detail label="Role"         value={admin.role.toUpperCase()} color="text-orange-400" />
          <Detail label="Joined"       value={new Date(admin.created_at).toLocaleDateString()} />
        </section>

        {/* Update form */}
        <section className="border-t border-gray-700 bg-[#181828] p-8">
          <h2 className="text-lg font-semibold text-green-400 mb-4">✏️ Edit Profile</h2>
          {msg && <p className="mb-4">{msg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name"
              className="w-full p-3 rounded bg-[#2b2b40] border border-gray-600 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="New Password (leave blank to keep)"
              className="w-full p-3 rounded bg-[#2b2b40] border border-gray-600 focus:outline-none"
            />
            <button className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold">
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </div>
    </div>
  );
}

function Detail({ label, value, color = 'text-white' }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className={`text-lg font-medium ${color}`}>{value}</p>
    </div>
  );
}

function Screen({ children, isError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
      <p className={isError ? 'text-red-500' : ''}>{children}</p>
    </div>
  );
}
