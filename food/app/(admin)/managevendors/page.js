'use client';

import { useEffect, useState } from 'react';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';

export default function ManageVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm]       = useState({
    name: '',
    email: '',
    password: '',
    business_name: '',
    description: '',
    location: ''
  });
  const router = useRouter();
  const [msg, setMsg] = useState('');

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

  /* ── initial load ─────────────────────── */
  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    const res  = await fetch('/api/admin/vendors');
    const data = await res.json();
    if (res.ok) setVendors(data.vendors || []);
    else setMsg(`❌ ${data.error}`);
  };

  /* ── field change ─────────────────────── */
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── create vendor ────────────────────── */
  const handleSubmit = async e => {
    e.preventDefault(); setMsg('');
    try {
      const res  = await fetch('/api/admin/vendors/create', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setForm({ name:'', email:'', password:'', business_name:'', description:'', location:'' });
      await fetchVendors();                           // refresh list
      setMsg('✅ Vendor created');
    } catch (err) { setMsg(`❌ ${err.message}`); }
  };

  /* ── delete vendor ────────────────────── */
  const handleDelete = async id => {
    if (!confirm('Delete this vendor and all related data?')) return;
    setMsg('');
    try {
      const res  = await fetch(`/api/admin/vendors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      await fetchVendors();                           // ensure removal
      setMsg('✅ Vendor deleted');
    } catch (err) { setMsg(`❌ ${err.message}`); }
  };

  /* ── UI ───────────────────────────────── */
  return (
    <div>
      <Anavbar />

      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
        <h1 className="text-4xl font-bold text-orange-400 text-center mb-8">🛠️ Manage Vendors</h1>

        {/* flash msg */}
        {msg && <p className="text-center mb-4">{msg}</p>}

        {/* create form */}
        <div className="max-w-3xl mx-auto bg-[#1e1e2f] p-6 rounded-xl shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-orange-400 mb-4 text-center">➕ Add Vendor</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input name="name"          value={form.name}          onChange={handleChange} placeholder="Full Name"   required className="bg-[#2b2b40] p-3 rounded"/>
            <input name="email"         value={form.email}         onChange={handleChange} placeholder="Email"       required className="bg-[#2b2b40] p-3 rounded"/>
            <input name="password"      value={form.password}      onChange={handleChange} placeholder="Password"    required className="bg-[#2b2b40] p-3 rounded" type="password"/>
            <input name="business_name" value={form.business_name} onChange={handleChange} placeholder="Business"    required className="bg-[#2b2b40] p-3 rounded"/>
            <input name="location"      value={form.location}      onChange={handleChange} placeholder="Location"            className="bg-[#2b2b40] p-3 rounded"/>
            <textarea name="description" value={form.description}  onChange={handleChange} placeholder="Description" className="bg-[#2b2b40] p-3 rounded md:col-span-2"/>
            <button className="bg-purple-900 hover:bg-black md:col-span-2 py-2 rounded">Create Vendor</button>
          </form>
        </div>

        {/* list */}
        <h2 className="text-2xl font-bold text-orange-300 mb-4">Existing Vendors</h2>
        {vendors.length === 0 ? (
          <p>No vendors yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(v => (
              <div key={v.id} className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl relative">
                <h3 className="text-lg font-semibold text-orange-200">{v.business_name}</h3>
                <p className="text-sm text-gray-400">{v.description}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {v.location}</p>
                <p className="text-xs text-gray-500 mt-1">👤 {v.name} • {v.email}</p>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
