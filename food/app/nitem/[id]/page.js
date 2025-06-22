'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Nnavbar from '@/components/Nnavbar';
import Footer  from '@/components/Footer';

export default function ItemDetailPage() {
  const { id }      = useParams();
  const [item, setItem]       = useState(null);
  const [qty,  setQty]        = useState(1);
  const [msg,  setMsg]        = useState('');
  const router = useRouter()
  /* fetch item once */
  useEffect(() => {
    if (!id) return;
    (async () => {
      const res  = await fetch(`/api/menu/${id}`);
      const data = await res.json();
      if (res.ok) setItem(data.item);
      else        setMsg(`❌ ${data.error}`);
    })();
  }, [id]);

  /* add to cart */
  const addToCart = async () => {
    router.push("/login")
  };

  if (!item) return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <Nnavbar/>
      <div className="max-w-4xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-10">
        <img src={item.image_url || '/no-image.png'} alt={item.name} className="w-full h-80 object-cover rounded-xl"/>
        <div>
          <h1 className="text-3xl font-bold text-orange-400 mb-2">{item.name}</h1>
          <p className="text-gray-300 mb-4">{item.description}</p>
          <p className="text-2xl font-semibold text-green-400 mb-6">Rs. {item.price}</p>

          <label className="block text-sm uppercase text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={e=>setQty(parseInt(e.target.value)||1)}
            className="w-24 bg-gray-800 border border-gray-600 rounded px-3 py-1 mb-4"
          />

          <button onClick={addToCart} className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-semibold">
            🛒 Add to Cart
          </button>

          {msg && <p className="mt-4 text-sm">{msg}</p>}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
