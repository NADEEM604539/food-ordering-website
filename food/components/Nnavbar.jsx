'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Nnavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gray-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-orange-400 hover:scale-105 transition-transform"
        >
          🍽️ NADEEM FOODS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`${
              isActive('/') ? 'text-orange-400 underline' : 'text-gray-300 hover:text-orange-400'
            } font-medium`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`${
              isActive('/about') ? 'text-orange-400 underline' : 'text-gray-300 hover:text-orange-400'
            } font-medium`}
          >
            About
          </Link>
          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-6 pb-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`block py-2 ${
              isActive('/') ? 'text-orange-400 underline' : 'text-gray-300 hover:text-orange-400'
            } font-medium`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className={`block py-2 ${
              isActive('/about') ? 'text-orange-400 underline' : 'text-gray-300 hover:text-orange-400'
            } font-medium`}
          >
            About
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block py-2 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg font-medium text-center"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}