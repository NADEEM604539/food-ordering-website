'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Vnavbar from '@/components/Vnavbar';

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/vendor/vendordashboard');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load dashboard');
        setVendor(data.vendor);
        setStats(data.stats);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
      <div>
            <Vnavbar/>
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <h1 className="text-4xl font-bold mb-6 text-orange-400 text-center">👨‍🍳 Vendor Dashboard</h1>

      <div className="bg-[#1e1e2f] rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-green-400">{vendor.business_name}</h2>
        <p className="text-sm text-gray-400">{vendor.description}</p>
        <p className="text-sm text-gray-400 mt-1">📍 {vendor.location}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Products" value={stats.productCount} />
        <StatCard title="Orders" value={stats.orderCount} />
        <StatCard title="Revenue" value={`Rs. ${stats.revenue}`} />
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => router.push('/vendormanageproducts')}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-lg"
        >
          🍽️ Manage Products
        </button>
      </div>
    </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-[#2e2e3f] p-4 rounded-lg shadow">
      <h3 className="text-xl text-orange-300 font-bold">{title}</h3>
      <p className="text-3xl mt-2">{value}</p>
    </div>
  );
}
