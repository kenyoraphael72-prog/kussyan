'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/components/AppContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, cartTotal, settings } = useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, total: cartTotal }),
      });
      const data = await res.json();

      const itemsSummary = cart
        .map((i) => `• ${i.name} x${i.quantity} ($${((i.price * i.quantity) / 100).toFixed(2)})`)
        .join('\n');
      const textMessage = `Hey, I want to place an order on ${settings.site_name}!\n\n${itemsSummary}\n\nTotal: $${(
        cartTotal / 100
      ).toFixed(2)}\nOrder ID: ${data.id || 'N/A'}`;

      if (settings.telegram_link) {
        const fullUrl = `${settings.telegram_link}?text=${encodeURIComponent(textMessage)}`;
        window.open(fullUrl, '_blank');
      } else {
        toast.success(`Order created! Total: $${(cartTotal / 100).toFixed(2)}`);
      }

      clearCart();
    } catch {
      toast.error('Failed to complete checkout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="text-3xl font-black uppercase text-white tracking-wider mb-2">Your Cart</h1>
        <p className="text-sm text-zinc-500 mb-8">Review your items and proceed with order confirmation.</p>

        {cart.length === 0 ? (
          <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111] border border-[#2a2000] flex items-center justify-center mx-auto text-[#b8860b]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Check out our catalog to add some premium items.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="md:col-span-2 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-zinc-900 border border-[#2a2000]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-[#2a2000] flex items-center justify-center text-zinc-600 text-xs">
                        N/A
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-[#b8860b] font-mono mt-0.5">
                        ${(item.price / 100).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#111] border border-[#2a2000] rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateCartQty(item.product_id, item.variant_id, item.quantity - 1)}
                        className="p-1.5 text-zinc-400 hover:text-[#d6a536] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-mono text-sm font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.product_id, item.variant_id, item.quantity + 1)}
                        className="p-1.5 text-zinc-400 hover:text-[#d6a536] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => removeFromCart(item.product_id, item.variant_id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary Card */}
            <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl p-6 h-fit space-y-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider border-b border-[#1a1200] pb-3">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono text-white font-bold">
                  ${(cartTotal / 100).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-zinc-400">
                <span>Estimated Tax</span>
                <span className="font-mono text-white font-bold">$0.00</span>
              </div>

              <div className="pt-3 border-t border-[#1a1200] flex justify-between items-center">
                <span className="text-base font-bold text-white">Total</span>
                <span className="text-2xl font-black font-mono text-[#d6a536]">
                  ${(cartTotal / 100).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#b8860b]/30 transition-all active:scale-95"
              >
                <Send size={16} />
                <span>{submitting ? 'Processing...' : 'Complete via Telegram'}</span>
              </button>

              <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                Orders are handled securely through Telegram / Direct Dispatch.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
