'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Vnavbar from '@/components/Vnavbar';

export default function AddProductPage() {
  const router = useRouter();

  /* ─── local state ─────────────────────────── */
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    res_name: '',
    price: '',
    category: '',
    image: null,      // File object
  });
  const [error, setError] = useState('');

  /* ─── vendor guard ────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/token');
        const { role, login } = await r.json();
        if (role !== 'vendor' || login !== 'true') router.push('/not-found');
      } catch {
        router.push('/not-found');
      }
    })();
  }, [router]);

  /* ─── fetch vendor restaurants ────────────── */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/vendor/restaurants/adddp');
        const j = await r.json();
        if (r.ok) setRestaurants(j.restaurants || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  /* ─── form helpers ─────────────────────────── */
  const changeField = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const setFile = (e) =>
    setFormData({ ...formData, image: e.target.files?.[0] || null });

  /* ─── submit new product ───────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.image) return setError('Choose an image.');

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await fetch('/api/vendor/products/add', { method: 'POST', body: data });
      const j   = await res.json();
      if (!res.ok) throw new Error(j.error || 'Save failed');
      alert('Product added ✔');
      router.push('/vendormanageproducts');
    } catch (err) {
      setError(err.message);
    }
  };

  /* ─── UI ───────────────────────────────────── */
  return (
    <div>
      <Vnavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex justify-center items-center p-4">
        <div className="w-full max-w-xl bg-[#1e1e2f] p-8 rounded-2xl shadow-2xl text-white">
          <h1 className="text-3xl font-bold text-center text-orange-400 mb-6">
            ➕ Add New Product
          </h1>

          {error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded-md mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={changeField}
              required
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />

            <select
              name="res_name"
              value={formData.res_name}
              onChange={changeField}
              required
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600"
            >
              <option value="">-- Select Restaurant --</option>
              {restaurants.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={changeField}
              required
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="number"
              name="price"
              placeholder="Price (e.g. 599.99)"
              value={formData.price}
              onChange={changeField}
              required
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />

            <input
              type="file"
              accept="image/*"
              onChange={setFile}
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />

            <input
              name="category"
              placeholder="Category (e.g. Biryani, Burger)"
              value={formData.category}
              onChange={changeField}
              className="w-full p-3 bg-[#2b2b40] rounded-md border border-gray-600 focus:ring-2 focus:ring-orange-500"
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-md font-semibold shadow-lg"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
