'use client';

import { useEffect, useState } from 'react';
import Anavbar from '@/components/Anavbar';
import { useRouter } from 'next/navigation';

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts(data.products || []);
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts(prev => prev.filter(p => p.id !== parseInt(id)));
      setMsg('✅ Product deleted');
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    }
  };

  return (
     <div>
            <Anavbar/>
    
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <h1 className="text-4xl font-bold text-orange-400 text-center mb-8">📦 Manage Products</h1>
      {msg && <p className="text-center mb-4">{msg}</p>}

      {products.length === 0 ? (
        <p className="text-center text-gray-400">No products found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-[#1a1a1a] p-4 rounded-xl shadow-lg relative">
              <h2 className="text-lg font-semibold text-orange-300">{product.name}</h2>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-sm text-green-400">💲{product.price}</p>
              <p className="text-xs text-gray-500 mt-1">🏬 {product.restaurant_name}</p>
              {product.image_url && (
                <img src={product.image_url} alt="Product" className="w-full h-40 object-cover mt-2 rounded" />
              )}
              <button
                onClick={() => handleDelete(product.id)}
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
