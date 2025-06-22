'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Vnavbar from '@/components/Vnavbar';

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [editId,   setEditId]   = useState(null);
  const [editData, setEditData] = useState({
    item_name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
  });

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

  /* ────────────── fetch products on load */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/vendor/products');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load products');
        setProducts(Array.isArray(json.products) ? json.products : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ────────────── delete product */
  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/vendor/products/${id}`, { method: 'DELETE' });
      if (res.ok) setProducts((p) => p.filter((x) => x.menu_item_id !== id));
      else alert('Delete failed');
    } catch {
      alert('Error deleting.');
    }
  };

  /* ────────────── start editing */
  const startEdit = (p) => {
    setEditId(p.menu_item_id);
    setEditData({
      item_name  : p.item_name,
      description: p.description,
      price      : p.price,
      category   : p.category,
      image_url  : p.image_url || '',
    });
  };

  /* ────────────── save edit */
  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/vendor/products/${editId}`, {
        method : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(editData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');

      setProducts((list) =>
        list.map((p) =>
          p.menu_item_id === editId ? { ...p, ...editData } : p
        )
      );
      setEditId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ────────────── cancel edit */
  const cancelEdit = () => setEditId(null);

  /* ────────────── render */
  return (
    <div>
      <Vnavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white">
        <h1 className="text-4xl font-bold mb-6 text-orange-400 text-center">
          🍽️ Manage Your Products
        </h1>

        {loading ? (
          <p className="text-center">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.menu_item_id}
                className="bg-[#1e1e2f] rounded-xl shadow-lg p-4"
              >
                <Image
                  src={p.image_url || '/placeholder.jpg'}
                  alt={p.item_name}
                  width={400}
                  height={250}
                  className="rounded-lg w-full h-48 object-cover mb-4"
                />

                {editId === p.menu_item_id ? (
                  <>
                    {/* edit mode */}
                    <input
                      className="w-full mb-2 px-3 py-1.5 rounded bg-gray-800"
                      value={editData.item_name}
                      onChange={(e) =>
                        setEditData({ ...editData, item_name: e.target.value })
                      }
                    />
                    <textarea
                      rows={2}
                      className="w-full mb-2 px-3 py-1.5 rounded bg-gray-800"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-full mb-2 px-3 py-1.5 rounded bg-gray-800"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                    />
                    <input
                      className="w-full mb-2 px-3 py-1.5 rounded bg-gray-800"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    />
                    <input
                      className="w-full mb-2 px-3 py-1.5 rounded bg-gray-800"
                      placeholder="Image URL"
                      value={editData.image_url}
                      onChange={(e) =>
                        setEditData({ ...editData, image_url: e.target.value })
                      }
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* display mode */}
                    <h3 className="text-xl font-semibold text-orange-300">
                      {p.item_name}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">{p.description}</p>
                    <p className="mt-2 text-lg font-bold text-green-400">
                      Rs.&nbsp;{p.price}
                    </p>
                    <p className="text-xs text-gray-400">Category: {p.category}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.menu_item_id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/vendormanageproducts/addproduct')}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-lg"
          >
            ➕ Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
