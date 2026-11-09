'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductManager from '@/components/admin/ProductManager';
import ContentEditor from '@/components/admin/ContentEditor';
import { ShieldCheck, Package, Type, LogOut, KeyRound } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, loginAdmin, logoutAdmin, settings } = useApp();
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passwordInput);
    if (!success) {
      setErrorMsg('Invalid admin password. Check your settings or use the default.');
    } else {
      setErrorMsg('');
      setPasswordInput('');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-[#0a0800] border border-[#2a2000] rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1200] border border-[#3d2f00] flex items-center justify-center mx-auto mb-4 text-[#d6a536]">
              <KeyRound size={24} />
            </div>
            <h1 className="text-xl font-black uppercase text-center tracking-wider text-white">
              Supertrapbros Admin
            </h1>
            <p className="text-xs text-zinc-500 text-center mt-1 mb-6">
              Enter your admin dashboard password to manage products and edit website text.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-center tracking-widest font-mono focus:border-[#b8860b] focus:outline-none"
                  autoFocus
                />
              </div>

              {errorMsg && <p className="text-xs text-red-400 text-center font-medium">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#b8860b]/30 transition-all"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1a1200]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#1a1200] border border-[#3d2f00] text-[#d6a536]">
                <ShieldCheck size={18} />
              </span>
              <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                Admin Control Center
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Store: <span className="text-[#d6a536] font-bold">{settings.site_name}</span> • Live Connected Database
            </p>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111] hover:bg-[#1a1200] text-zinc-400 hover:text-[#d6a536] border border-[#2a2000] text-xs font-bold transition-all"
          >
            <LogOut size={14} />
            <span>Lock Dashboard</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 my-6 border-b border-[#1a1200] pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'products'
                ? 'bg-[#b8860b] text-black shadow-lg shadow-[#b8860b]/30'
                : 'text-zinc-400 hover:text-[#d6a536] hover:bg-[#1a1200]'
            }`}
          >
            <Package size={16} />
            <span>Manage Products</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'content'
                ? 'bg-[#b8860b] text-black shadow-lg shadow-[#b8860b]/30'
                : 'text-zinc-400 hover:text-[#d6a536] hover:bg-[#1a1200]'
            }`}
          >
            <Type size={16} />
            <span>Edit Website Text &amp; Info</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-2">
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'content' && <ContentEditor />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
