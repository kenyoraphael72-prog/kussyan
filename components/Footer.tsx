'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/AppContext';

export default function Footer() {
  const { settings } = useApp();

  return (
    <footer className="border-t border-[#1a1200] bg-[#050300] py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-lg font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#d6a536] to-[#8f6b21]">
            {settings.site_name || 'Supertrapbros'}
          </span>
          <p className="text-xs text-zinc-600 mt-1">
            {settings.tagline || 'Premium Selection'} • All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/products" className="hover:text-[#d6a536] transition-colors">Menu</Link>
          <Link href="/about" className="hover:text-[#d6a536] transition-colors">About</Link>
          {settings.telegram_link && (
            <a
              href={settings.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b8860b] hover:text-[#d6a536] font-semibold transition-colors"
            >
              Telegram
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
