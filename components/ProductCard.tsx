'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useApp } from '@/components/AppContext';
import { ShoppingBag, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const wish = isWishlisted(product.id);

  const displayPrice = (product.price / 100).toFixed(2);
  const mainImage = product.images?.[0] || '/placeholder.svg';

  return (
    <div className="group relative bg-[#0e0e0e] border border-[#2a2000]/80 rounded-2xl overflow-hidden hover:border-[#b8860b]/60 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(184,134,11,0.15)]">
      {/* Top Image Container — clicking the image/name goes to detail page */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
          {mainImage.startsWith('http') || mainImage.startsWith('/') ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold">
              NO IMAGE
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.product_type && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1a1200]/90 text-[#d6a536] border border-[#b8860b]/40 backdrop-blur-md">
                {product.product_type}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button — stays outside the link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
          wish ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-black/50 text-zinc-500 hover:text-white border border-white/10'
        }`}
      >
        <Heart size={16} fill={wish ? 'currentColor' : 'none'} />
      </button>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-white text-base leading-tight group-hover:text-[#d6a536] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#1a1200] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 block">Price</span>
            <span className="text-lg font-black text-[#d6a536] font-mono">${displayPrice}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#b8860b]/20 hover:shadow-[#d6a536]/30 transition-all active:scale-95"
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
