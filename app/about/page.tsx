'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/components/AppContext';
import { ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1200] border border-[#3d2f00] text-[#d6a536] text-xs font-bold tracking-wider uppercase">
            <Sparkles size={14} />
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
            About {settings.site_name}
          </h1>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            {settings.tagline}
          </p>
        </div>

        <div className="bg-[#0a0800] border border-[#1a1200] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="space-y-6 text-zinc-300 text-base leading-relaxed">
            <p className="text-lg text-white font-medium">
              {settings.about_text}
            </p>
            <p>
              We pride ourselves on offering only curated, verified, and top-tier selections. Our direct line connects you straight to source inventory with no unnecessary middlemen.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#1a1200] grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#111]/60 border border-[#2a2000]">
              <div className="p-3 rounded-xl bg-[#1a1200] text-[#d6a536]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Discreet &amp; Direct</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Reliable contact methods and swift responses.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#111]/60 border border-[#2a2000]">
              <div className="p-3 rounded-xl bg-[#1a1200] text-[#d6a536]">
                <Send size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Direct Contact</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Reach out directly via Telegram for custom requests and bulk inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        {(settings.telegram_link || settings.phone_number || settings.email) && (
          <div className="bg-[#0a0800] border border-[#1a1200] rounded-3xl p-8 shadow-xl">
            <h2 className="text-lg font-black uppercase tracking-wider text-white mb-6">Get in Touch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {settings.telegram_link && (
                <a
                  href={settings.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#111]/60 border border-[#2a2000] text-zinc-300 hover:text-[#d6a536] hover:border-[#b8860b]/50 transition-all"
                >
                  <Send size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider">Telegram</span>
                </a>
              )}
              {settings.phone_number && (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#111]/60 border border-[#2a2000] text-zinc-300 hover:text-[#d6a536] hover:border-[#b8860b]/50 transition-all"
                >
                  <ShieldCheck size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider">Call Us</span>
                  <span className="text-xs text-zinc-500">{settings.phone_number}</span>
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#111]/60 border border-[#2a2000] text-zinc-300 hover:text-[#d6a536] hover:border-[#b8860b]/50 transition-all"
                >
                  <Sparkles size={24} />
                  <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                  <span className="text-xs text-zinc-500 truncate max-w-full">{settings.email}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
