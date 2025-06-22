'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react'; // npm install lucide-react

export default function Anavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        window.location.href = '/';
      } else {
        const errorText = await res.text();
        console.error('Logout failed:', errorText);
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  const isActive = (path) => pathname === path;

  const links = [
    { href: '/admindashboard', label: 'DASHBOARD' },
    { href: '/managevendors', label: 'VENDORS' },
    { href: '/adminmanageproducts', label: ' PRODUCTS' },
    { href: '/adminmanageorders', label: 'ORDERS' },
    { href: '/managecustomers', label: 'CUSTOMERS' },
    { href: '/adminprofile', label: 'PROFILE' },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-orange-400 font-extrabold text-2xl tracking-wide">
          🍽️ NADEEM FOODS
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold transition ${
                isActive(href) ? 'text-orange-400' : 'text-white hover:text-orange-400'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl text-sm"
          >
            Log Out
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-gray-900 rounded-b-2xl shadow-inner">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block text-sm font-medium py-2 px-2 rounded-lg ${
                isActive(href) ? 'text-orange-400' : 'text-white hover:text-orange-400'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-sm"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
