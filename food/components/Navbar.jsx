'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /* ───────────────────────────
     Fetch cart badge once
  ─────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/cart/count');
        const json = await res.json();
        setCartCount(json.count || 0);
      } catch (err) {
        console.error('[CART_COUNT]', err);
      }
    })();
  }, []);

  /* ───────────────────────────
     Logout handler
  ─────────────────────────── */
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('[LOGOUT]', err);
    }
  };

  /* ───────────────────────────
     Helpers
  ─────────────────────────── */
  const isActive = (href) => pathname === href;

  const navClass = (href) =>
    `block px-2 py-1 rounded-md transition ${
      isActive(href)
        ? 'text-orange-400 font-semibold'
        : 'text-white hover:text-orange-400'
    }`;

  /* ───────────────────────────
     Page links (one source of truth)
  ─────────────────────────── */
  const links = [
    { href: '/customerdashboard', label: 'Dashboard' },
    { href: '/homepage', label: 'Home' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/orders', label: 'Orders' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <nav className="bg-black/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold text-orange-400 whitespace-nowrap"
          >
            🍽️ NADEEM&nbsp;FOODS
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={navClass(href)}>
                {label}
              </Link>
            ))}

            {/* Cart button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-white hover:text-orange-400 transition"
            >
              <FiShoppingCart className="text-lg" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-orange-500 text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-400 transition"
            >
              <FiLogOut />
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="md:hidden bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <ul className="px-4 py-6 space-y-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={navClass(href)}
                >
                  {label}
                </Link>
              </li>
            ))}

            {/* Cart */}
            <li>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-white hover:text-orange-400 transition"
              >
                <FiShoppingCart />
                Cart&nbsp;({cartCount})
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1 text-red-500 hover:text-red-400 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
