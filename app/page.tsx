'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/components/AppContext';
import { Search, SlidersHorizontal } from 'lucide-react';

const TYPES = ['All', 'INDOOR', 'Indoor mediums', 'indoor smalls', 'licensed exotic', 'licensed indoor', 'mixed light'];

export default function HomePage() {
  const { settings, products } = useApp();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'All' || p.product_type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden px-4 py-14 sm:py-20 border-b border-[#1a1200] bg-gradient-to-b from-[#0d0900] to-black">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#b8860b]">
              {settings.tagline || 'Premium Selection'}
            </p>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none">
              {settings.hero_title || 'Top Shelf'}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
              {settings.hero_subtitle || 'Browse our exclusive catalog of top-shelf products.'}
            </p>
          </div>
          {/* Glow decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#b8860b]/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* Search + Filter */}
        <section className="sticky top-20 z-30 bg-black/95 backdrop-blur-md border-b border-[#1a1200] px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#111] border border-[#2a2000] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#b8860b] transition-colors"
              />
            </div>

            {/* Type Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <SlidersHorizontal size={14} className="text-zinc-600 mr-1" />
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    activeType === t
                      ? 'bg-[#b8860b] text-black shadow-lg shadow-[#b8860b]/30'
                      : 'bg-[#111] text-zinc-400 border border-[#2a2000] hover:border-[#b8860b]/40 hover:text-[#d6a536]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              {products.length === 0 ? (
                <>
                  <p className="text-zinc-500 text-sm">No products in the catalog yet.</p>
                  <p className="text-zinc-600 text-xs">Products will appear here once added.</p>
                </>
              ) : (
                <p className="text-zinc-500 text-sm">No products match your search.</p>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs text-zinc-600 mb-6">
                Showing <span className="text-[#d6a536] font-bold">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
