// app/vendor/manageorders/page.js
'use client';
import { useEffect, useState } from 'react';
import Vnavbar from '@/components/Vnavbar';
import { useRouter } from 'next/navigation';

const STATUS_COLORS = {
  pending:    'bg-yellow-600',
  preparing:  'bg-blue-600',
  delivered:  'bg-green-600',
  cancelled:  'bg-red-600',
};

export default function ManageOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const router= useRouter()

  
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

  /* ─────────── Fetch vendor orders on mount ─────────── */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/vendor/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load orders');
        const arr = Array.isArray(data.orders) ? data.orders : data;
        setOrders(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─────────── Update order status ─────────── */
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/vendor/orders?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setOrders(prev => prev.map(o => (o.order_id === id ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─────────── Delete order ─────────── */
  const deleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/vendor/orders?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setOrders(prev => prev.filter(o => o.order_id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─────────── UI helpers ─────────── */
  if (loading) return <Screen msg="Loading orders…" />;
  if (error)   return <Screen msg={error} isError />;

  return (
    <div>
        <Vnavbar/>
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
          <h1 className="text-4xl font-bold mb-6 text-orange-400 text-center">📦 Orders Management</h1>
    
          {orders.length === 0 ? (
            <Screen msg="No orders yet." />
          ) : (
            <div className="grid gap-6">
              {orders.map((o) => (
                <div key={o.order_id} className="bg-[#1e1e2f] p-5 rounded-xl shadow-md border border-gray-700">
                  {/* Header */}
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold text-orange-300">Order #{o.order_id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-md ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </div>
    
                  {/* Customer & Payment */}
                  <p className="text-sm mt-1 text-gray-300">Customer: {o.customer_name} ({o.customer_email})</p>
                  <p className="text-sm text-gray-400">Date: {new Date(o.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Payment: {o.payment_method ?? 'N/A'} ({o.payment_status ?? 'N/A'})</p>
                  <p className="text-xs text-gray-500 mb-3">Txn-ID: {o.transaction_id ?? '--'}</p>
    
                  {/* Items */}
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Items:</p>
                    <ul className="list-disc ml-6 space-y-0.5">
                      {o.items.map((it, idx) => (
                        <li key={idx} className="text-gray-300">{it.name} × {it.quantity} — Rs. {it.price}</li>
                      ))}
                    </ul>
                  </div>
    
                  <p className="mt-3 text-lg font-bold text-green-400">Total: Rs. {o.total_price}</p>
    
                  {/* Actions */}
                  <div className="mt-4 flex gap-3 items-center">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.order_id, e.target.value)}
                      className="bg-[#2b2b40] border border-gray-600 rounded-md px-3 py-1 text-sm"
                    >
                      {['pending', 'preparing', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
    
                    <button
                      onClick={() => deleteOrder(o.order_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
      );
    }

function Screen({ msg, isError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <p className={isError ? 'text-red-500' : ''}>{msg}</p>
    </div>
  );
}
