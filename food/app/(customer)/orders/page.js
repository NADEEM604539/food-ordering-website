'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,  setError]    = useState('');
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


  /* ── load orders on mount ───────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load orders');
        }
        const text = await res.text();            // safer parse
        const data = text ? JSON.parse(text) : {};
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── UI ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-orange-400 mb-6 text-center">🧾 Your Orders</h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading orders…</p>
        ) : error ? (
          <p className="text-center text-red-500">❌ {error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => router.push(`/orders/${o.id}`)}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-orange-300">Order #{o.id}</h2>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    o.status === 'delivered'  ? 'bg-green-700'  :
                    o.status === 'preparing'  ? 'bg-yellow-700' :
                    o.status === 'cancelled'  ? 'bg-red-700'    :
                                                'bg-gray-700'
                  }`}>
                    {o.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Restaurant: {o.restaurant_name}</p>
                <p className="text-sm text-gray-400">Total: Rs. {o.total_price}</p>
                <p className="text-xs text-gray-500 mt-1">📅 {new Date(o.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
