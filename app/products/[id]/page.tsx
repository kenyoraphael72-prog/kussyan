'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/components/AppContext';
import { Product } from '@/lib/types';
import {
  ShoppingCart,
  Send,
  Heart,
  Image as ImageIcon,
  Play,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, settings } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [addedToCart, setAddedToCart] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#b8860b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 text-lg mb-4">Product not found.</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 rounded-xl bg-[#b8860b] text-black font-bold text-sm uppercase"
            >
              Back to Catalog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = product.images?.[0] || '';
  const videoUrl = product.metadata?.video_url || '';
  const shipPrice = product.metadata?.retail_price ?? (product.price / 100);
  const inTownPrice = product.metadata?.wholesale_price;

  const shipLabel = settings.ship_label || 'Ship';
  const inTownLabel = settings.intown_label || 'In Town';
  const addToCartText = settings.add_to_cart_button_text || 'ADD TO CART';
  const buyTelegramText = settings.buy_telegram_button_text || 'BUY ON TELEGRAM';
  const telegramLabel = settings.telegram_contact_label || 'TELEGRAM';
  const localLabel = settings.local_contact_label || 'LOCAL';
  const telegramLink = settings.telegram_link || '#';
  const phoneNumber = settings.phone_number || '#';

  const wished = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-[#d6a536] text-sm font-semibold transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Product Name */}
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
            {product.name}
          </h1>

          {/* Type Badge */}
          {product.product_type && (
            <div className="mb-5">
              <span className="text-sm font-bold text-zinc-300 italic">
                {product.product_type}
              </span>
            </div>
          )}

          {/* Prices */}
          <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2 text-xl font-black text-white">
              <span>${Number(shipPrice).toFixed(2)}</span>
              <span className="text-zinc-400 font-normal text-base">-</span>
              <span>🚢</span>
              <span className="text-white">{shipLabel}</span>
            </div>
            {inTownPrice != null && Number(inTownPrice) > 0 && (
              <div className="flex items-center gap-2 text-xl font-black text-white">
                <span>${Number(inTownPrice).toFixed(2)}</span>
                <span className="text-zinc-400 font-normal text-base">-</span>
                <span>📍</span>
                <span className="text-white">{inTownLabel}</span>
              </div>
            )}
          </div>

          {/* Image / Video Tab Switcher */}
          <div className="mb-4">
            <div className="flex gap-2 bg-[#111] border border-[#2a2000] rounded-2xl p-1 w-fit">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'image'
                    ? 'bg-[#1a1200] text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <ImageIcon size={16} />
                Image
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'video'
                    ? 'bg-[#1a1200] text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Play size={16} />
                Video
              </button>
            </div>
          </div>

          {/* Media Display */}
          <div className="mb-6 rounded-2xl overflow-hidden border border-[#2a2000] bg-[#0a0800]">
            {activeTab === 'image' ? (
              mainImage ? (
                <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-72 flex items-center justify-center text-zinc-600 font-bold text-sm">
                  NO IMAGE
                </div>
              )
            ) : (
              <div className="w-full" style={{ aspectRatio: '4/3' }}>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={mainImage || undefined}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                    <Play size={40} className="opacity-30" />
                    <span className="text-sm font-medium">No video available for this product</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-black text-base uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[#b8860b]/30"
            >
              <ShoppingCart size={20} />
              {addedToCart ? '✓ ADDED!' : addToCartText}
            </button>

            {/* BUY ON TELEGRAM */}
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-black text-base uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[#b8860b]/30"
            >
              <Send size={20} />
              {buyTelegramText}
            </a>

            {/* ADD TO FAVORITES */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl border font-black text-base uppercase tracking-widest transition-all active:scale-[0.98] ${
                wished
                  ? 'bg-red-950/40 border-red-500/50 text-red-400'
                  : 'bg-[#0a0800] border-[#2a2000] text-zinc-300 hover:border-[#b8860b]/50 hover:text-[#d6a536]'
              }`}
            >
              <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
              {wished ? '♡ SAVED TO FAVORITES' : '♡ ADD TO FAVORITES'}
            </button>
          </div>

          {/* Contact Buttons — TELEGRAM + LOCAL */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl bg-[#0a0800] border border-[#2a2000] hover:border-[#b8860b]/50 text-zinc-300 hover:text-[#d6a536] transition-all"
            >
              <Send size={22} />
              <span className="text-xs font-black uppercase tracking-widest">{telegramLabel}</span>
            </a>
            <a
              href={`tel:${phoneNumber}`}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl bg-[#0a0800] border border-[#2a2000] hover:border-[#b8860b]/50 text-zinc-300 hover:text-[#d6a536] transition-all"
            >
              <Phone size={22} />
              <span className="text-xs font-black uppercase tracking-widest">{localLabel}</span>
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

