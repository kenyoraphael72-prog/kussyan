'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/components/AppContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
  const { cartCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#2a2000] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white sm:hidden"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.jpg"
            alt="Supertrapbros"
            width={160}
            height={160}
            className="h-16 w-16 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-200 shadow-xl shadow-[#b8860b]/30"
            priority
          />
        </Link>

        {/* Desktop Nav Links — NO admin link visible to public */}
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/products" className="text-sm font-semibold text-zinc-300 hover:text-[#d6a536] transition-colors">
            Menu
          </Link>
          <Link href="/about" className="text-sm font-semibold text-zinc-300 hover:text-[#d6a536] transition-colors">
            About
          </Link>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl bg-[#111] border border-[#2a2000] text-zinc-300 hover:text-[#d6a536] hover:border-[#b8860b] transition-all flex items-center justify-center"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#b8860b] text-black text-xs font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Dropdown — clean, no admin link */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#2a2000] bg-[#0a0800] px-4 py-4 space-y-1">
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-[#1a1200] hover:text-[#d6a536] transition-colors"
          >
            Menu / Products
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-[#1a1200] hover:text-[#d6a536] transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-300 hover:bg-[#1a1200] hover:text-[#d6a536] transition-colors"
          >
            Cart
          </Link>
        </div>
      )}
    </header>
  );
}
