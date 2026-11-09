'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function ContentEditor() {
  const { settings, updateLocalSetting, refreshSettings } = useApp();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site_name: settings.site_name || 'Supertrapbros',
    tagline: settings.tagline || 'Premium Selection',
    hero_title: settings.hero_title || 'Top Shelf',
    hero_subtitle: settings.hero_subtitle || 'Browse our exclusive catalog of top-shelf products',
    about_text: settings.about_text || 'Welcome to Supertrapbros — your go-to source for premium quality products.',
    telegram_link: settings.telegram_link || '',
    phone_number: settings.phone_number || '',
    email: settings.email || '',
    primary_color: settings.primary_color || '#b8860b',
    secondary_color: settings.secondary_color || '#66521a',
    admin_password: settings.admin_password || 'supertrapbros2024',
    store_password: settings.store_password || '',
    // Product page button labels
    add_to_cart_button_text: settings.add_to_cart_button_text || 'ADD TO CART',
    buy_telegram_button_text: settings.buy_telegram_button_text || 'BUY ON TELEGRAM',
    ship_label: settings.ship_label || 'Ship',
    intown_label: settings.intown_label || 'In Town',
    telegram_contact_label: settings.telegram_contact_label || 'TELEGRAM',
    local_contact_label: settings.local_contact_label || 'LOCAL',
  });

  const handleChange = (k: string, val: string) => {
    setForm((prev) => ({ ...prev, [k]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      Object.entries(form).forEach(([k, v]) => updateLocalSetting(k, v));
      await refreshSettings();

      toast.success('All site text and settings updated successfully!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Brand & Names Section */}
      <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-black uppercase text-[#d6a536] tracking-wider mb-1">
          Brand Name &amp; Core Titles
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Changes here update the headers, logos, and page titles across the entire website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Website Name</label>
            <input
              type="text"
              value={form.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white font-bold focus:border-[#b8860b] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Hero Title (Homepage)</label>
            <input
              type="text"
              value={form.hero_title}
              onChange={(e) => handleChange('hero_title', e.target.value)}
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Hero Subtitle</label>
            <input
              type="text"
              value={form.hero_subtitle}
              onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* About Us & Descriptions */}
      <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-black uppercase text-[#d6a536] tracking-wider mb-1">
          About Page &amp; Descriptions
        </h3>
        <p className="text-xs text-zinc-500 mb-6">Edit the main description of your brand.</p>

        <div>
          <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">About Text</label>
          <textarea
            rows={4}
            value={form.about_text}
            onChange={(e) => handleChange('about_text', e.target.value)}
            className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-black uppercase text-[#d6a536] tracking-wider mb-1">
          Contact &amp; Telegram Integrations
        </h3>
        <p className="text-xs text-zinc-500 mb-6">Links used for checkout and direct client contact.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Telegram Link</label>
            <input
              type="text"
              value={form.telegram_link}
              onChange={(e) => handleChange('telegram_link', e.target.value)}
              placeholder="https://t.me/yourchannel"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Phone Number</label>
            <input
              type="text"
              value={form.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              placeholder="+1234567890"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Support Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@supertrapbros.com"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-black uppercase text-[#d6a536] tracking-wider mb-1">
          Passwords &amp; Access Control
        </h3>        <p className="text-xs text-zinc-500 mb-6">Admin dashboard login password and optional store gate password.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Admin Dashboard Password</label>
            <input
              type="text"
              value={form.admin_password}
              onChange={(e) => handleChange('admin_password', e.target.value)}
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white font-mono focus:border-[#b8860b] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Store Front Password (Optional)</label>
            <input
              type="text"
              value={form.store_password}
              onChange={(e) => handleChange('store_password', e.target.value)}
              placeholder="Leave empty for public store"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white font-mono focus:border-[#b8860b] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Product Page Buttons */}
      <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-black uppercase text-[#d6a536] tracking-wider mb-1">
          🛒 Product Page Buttons &amp; Labels
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          Edit the text on every button and label shown on the product detail page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Add to Cart Button Text</label>
            <input
              type="text"
              value={form.add_to_cart_button_text}
              onChange={(e) => handleChange('add_to_cart_button_text', e.target.value)}
              placeholder="ADD TO CART"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Buy on Telegram Button Text</label>
            <input
              type="text"
              value={form.buy_telegram_button_text}
              onChange={(e) => handleChange('buy_telegram_button_text', e.target.value)}
              placeholder="BUY ON TELEGRAM"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">🚢 Ship Label (shown next to Ship price)</label>
            <input
              type="text"
              value={form.ship_label}
              onChange={(e) => handleChange('ship_label', e.target.value)}
              placeholder="Ship"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">📍 In Town Label (shown next to In Town price)</label>
            <input
              type="text"
              value={form.intown_label}
              onChange={(e) => handleChange('intown_label', e.target.value)}
              placeholder="In Town"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Telegram Contact Button Label</label>
            <input
              type="text"
              value={form.telegram_contact_label}
              onChange={(e) => handleChange('telegram_contact_label', e.target.value)}
              placeholder="TELEGRAM"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold text-zinc-400 block mb-1">Local Contact Button Label</label>
            <input
              type="text"
              value={form.local_contact_label}
              onChange={(e) => handleChange('local_contact_label', e.target.value)}
              placeholder="LOCAL"
              className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-2.5 text-white focus:border-[#b8860b] focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#b8860b]/30 transition-all active:scale-95"
        >
          <Save size={18} />
          <span>{saving ? 'Saving Changes...' : 'Save All Website Text'}</span>
        </button>
      </div>
    </form>
  );
}
