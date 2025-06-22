'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/token');
        if (!res.ok) throw new Error('Unauthorized');

        const { role, login } = await res.json();

        console.log('Role:', role);
        console.log('Login:', login);

        // Redirect if not admin or not logged in
        if (role !== 'customer' || login !== 'true') {
          router.push('/login');
        }

      } catch (err) {
        console.error('Error fetching cookies:', err.message);
        router.push('/login'); // fallback redirect on error
      }
    }

    fetchToken(); // call the async function

  }, [router]); 

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load order');
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        setOrder(data.order || null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unexpected error');
      }
    })();
  }, [id]);

  if (error)
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center mt-20 text-red-500">{error}</div>
        <Footer />
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center mt-20 text-gray-400">Loading order details…</div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-orange-400 mb-6">📦 Order #{order.id}</h1>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-400">Restaurant: <span className="text-orange-300">{order.restaurant_name}</span></p>
          <p className="text-sm text-gray-400">Status: <span className="text-orange-300">{order.status}</span></p>
          <p className="text-sm text-gray-400">Total: Rs. {order.total_price}</p>
          <p className="text-sm text-gray-500">📅 {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <h2 className="text-xl font-semibold text-orange-300 mb-4">🧾 Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 border border-gray-700 rounded p-4"
            >
              <h3 className="text-lg text-white font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
              <p className="text-sm text-gray-400">Price: Rs. {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
