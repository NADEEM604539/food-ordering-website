'use client';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

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
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load');
        setData(json);
      } catch (e) {
        setErr(e.message);
      }
    };
    fetchData();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-500',
    preparing: 'bg-blue-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div>
        <Anavbar/>


    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-orange-400 text-center mb-10">📊 Admin Dashboard</h1>

      {err && <p className="text-red-500 text-center mb-4">❌ {err}</p>}
      {!data && !err && <p className="text-center text-gray-400">Loading...</p>}

      {data && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {Object.entries(data.metrics).map(([label, value]) => (
              <div key={label} className="bg-[#1f1f2f] p-6 rounded-xl shadow text-center">
                <h2 className="text-xl font-semibold text-orange-300 capitalize">{label}</h2>
                <p className="text-3xl font-bold text-green-400 mt-2">{value}</p>
              </div>
            ))}
          </div>

          {/* Order Status Summary */}
          <div className="bg-[#1e1e2e] p-6 rounded-xl mb-10 shadow">
            <h2 className="text-2xl font-semibold text-orange-300 mb-4">📦 Orders by Status</h2>
            <div className="flex flex-wrap gap-4">
              {data.ordersByStatus.map(status => (
                <div
                  key={status.status}
                  className={`px-6 py-3 rounded-lg shadow text-white ${statusColors[status.status] || 'bg-gray-600'}`}
                >
                  <p className="text-lg capitalize">{status.status}</p>
                  <p className="text-2xl font-bold">{status.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#1e1e2e] p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-orange-300 mb-4">🕓 Recent Orders</h2>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Customer</th>
                    <th className="p-2">Restaurant</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-800">
                      <td className="p-2 text-gray-300">{order.id}</td>
                      <td className="p-2">{order.customer_name}<br /><span className="text-xs text-gray-500">{order.customer_email}</span></td>
                      <td className="p-2">{order.restaurant_name}</td>
                      <td className="p-2 text-green-400">Rs {order.total_price}</td>
                      <td className="p-2 capitalize text-white">{order.status}</td>
                      <td className="p-2 text-gray-400">{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
}
