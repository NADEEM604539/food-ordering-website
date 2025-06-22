'use client';

import { useEffect, useState } from 'react';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
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

  const fetchCustomers = async () => {
    const res = await fetch('/api/admin/customers');
    if (res.ok) {
      const data = await res.json();
      setCustomers(data.customers || []);
    } else {
      console.error('Failed to load customers');
    }
  };

  const deleteCustomer = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCustomers(); // refresh list
    } else {
      alert('❌ Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
     <div>
            <Anavbar/>
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] to-[#111] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-8 text-center">👥 Manage Customers</h1>

        {customers.length === 0 ? (
          <p className="text-center text-gray-400">No customers found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {customers.map((c) => (
              <div key={c.id} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-orange-300">{c.name}</h2>
                <p className="text-sm text-gray-400">{c.email}</p>
                <button
                  onClick={() => deleteCustomer(c.id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg transition-all"
                >
                  ❌ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
