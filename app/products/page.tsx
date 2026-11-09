'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/components/AppContext';
import { Search, SlidersHorizontal } from 'lucide-react';

const TYPES = ['All', 'INDOOR', 'Indoor mediums', 'indoor smalls', 'licensed exotic', 'licensed indoor', 'mixed light'];

export default function ProductsPage() {
  const { products } = useApp();
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
        {/* Page Title */}
        <div className="border-b border-[#1a1200] px-4 py-8 bg-[#040300]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black uppercase tracking-wider text-white">Full Catalog</h1>
            <p className="text-xs text-zinc-500 mt-1">
              <span className="text-[#d6a536] font-bold">{products.length}</span> products available
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="sticky top-20 z-30 bg-black/95 backdrop-blur-md border-b border-[#1a1200] px-4 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or strain..."
                className="w-full bg-[#111] border border-[#2a2000] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#b8860b] transition-colors"
              />
            </div>
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
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-zinc-500 text-sm">No products match your search.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-zinc-600 mb-6">
                Showing <span className="text-[#d6a536] font-bold">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
