'use client';

import { useEffect, useState } from 'react';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
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
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders || []);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(prev => prev.filter(o => o.id !== parseInt(id)));
      setMsg('✅ Order deleted');
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
     <div>
            <Anavbar/>
    
    
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] p-6 text-white">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">📋 Manage Orders</h1>
      {msg && <p className="text-center mb-4">{msg}</p>}

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-[#333] text-orange-300 text-left text-sm uppercase tracking-wider">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Restaurant</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-[#444] text-sm">
                  <td className="px-4 py-3 text-yellow-200 font-medium">#{order.id}</td>
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3 text-gray-400">{order.customer_email}</td>
                  <td className="px-4 py-3">{order.restaurant_name}</td>
                  <td className="px-4 py-3 text-green-400">${order.total_price}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}
