// app/vendor/profile/page.js
'use client';

import { useEffect, useState } from 'react';
import Vnavbar from '@/components/Vnavbar';
import { useRouter } from 'next/navigation';

export default function VendorProfilePage() {
  const [form, setForm] = useState({ business_name: '', description: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const router= useRouter()
  /* ─────────── Fetch profile on mount ─────────── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/vendor/profile');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');
        setForm(data.vendor);
      } catch (err) {
        setMsg(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
   useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');

        const { role, login } = await res.json();

        console.log('Role:', role);
        console.log('Login:', login);

        // Redirect if not admin or not logged in
        if (role !== 'vendor' || login !== 'true') {
          router.push('/not-found');
        }

      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/not-found'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res  = await fetch('/api/vendor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setMsg('✅ Profile updated');
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading…</div>;

  return (
      <div>
            <Vnavbar/>
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-orange-400 text-center">👤 Vendor Profile</h1>

      {msg && <p className="text-center mb-4 text-yellow-400">{msg}</p>}

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-[#1e1e2f] p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Business Name</label>
          <input
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded bg-[#2c2c3e] text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#2c2c3e] text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-300">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-[#2c2c3e] text-white"
          />
        </div>
        <button className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md">💾 Save</button>
      </form>
    </div>
    </div>
  );
}