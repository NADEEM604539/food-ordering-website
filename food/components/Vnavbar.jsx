'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Vnavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (p) => pathname === p;

  const logout = async () => {
    try {
      const r = await fetch('/api/logout', { method: 'POST' });
      if (r.ok) window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="bg-gray-950 border-b border-gray-800 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-orange-400 font-extrabold text-2xl tracking-wide">
          🍽️ NADEEM FOODS
        </Link>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div
          className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col bg-gray-950 border-t border-gray-800
                       md:static md:flex md:flex-row md:space-x-6 md:w-auto md:border-0`}
        >
          <Link href="/vendordashboard" className={`px-4 py-2 text-sm font-semibold ${active('/vendordashboard') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            DASHBOARD
          </Link>
          <Link href="/vendorrestaurants" className={`px-4 py-2 text-sm font-semibold ${active('/vendorrestaurants') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            RESTAURANTS
          </Link>
          <Link href="/vendormanageproducts/addproduct" className={`px-4 py-2 text-sm font-semibold ${active('/vendormanageproducts/addproduct') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            ADD PRODUCTS
          </Link>
          <Link href="/manageorders" className={`px-4 py-2 text-sm font-semibold ${active('/manageorders') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            ORDERS
          </Link>
          <Link href="/vendormanageproducts" className={`px-4 py-2 text-sm font-semibold ${active('/vendormanageproducts') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            PRODUCTS
          </Link>
          <Link href="/vendorprofile" className={`px-4 py-2 text-sm font-semibold ${active('/vendorprofile') ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}>
            PROFILE
          </Link>
          <button onClick={logout} className="mx-4 my-2 md:my-0 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl text-sm">
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
