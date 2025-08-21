'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { CartIcon } from './cart/cart-icon';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop Coffee', href: '/shop/coffee' },
    { name: 'Contact', href: '/contact' },
    { name: 'Cart', href: '/cart' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-rose-600 bg-clip-text text-transparent hover:from-amber-800 hover:to-rose-700 transition-all duration-300">
              Anagioprim Healthy Coffee
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 px-4 py-2 text-sm font-semibold transition-colors duration-300 relative group"
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA & Cart */}
          <div className="hidden lg:flex items-center space-x-4">
            <CartIcon />
            <Button size="sm" className="bg-gradient-to-r from-amber-700 to-rose-600 hover:from-amber-800 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 px-6 py-2.5 font-semibold">
              <Link href="/shop/coffee">Shop Coffee</Link>
            </Button>
          </div>

          {/* Mobile Cart & Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <CartIcon />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-300 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Button size="sm" className="w-full bg-gradient-to-r from-amber-700 to-rose-600 hover:from-amber-800 hover:to-rose-700 text-white shadow-lg font-semibold py-3">
                  <Link href="/shop/coffee" onClick={() => setMobileMenuOpen(false)}>Shop Coffee</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
