'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { toast } from 'sonner';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Products', value: 'ALL' },
  { label: 'INDOOR', value: 'INDOOR' },
  { label: 'Indoor Mediums', value: 'Indoor mediums' },
  { label: 'Indoor Smalls', value: 'indoor smalls' },
  { label: 'Licensed Exotic', value: 'licensed exotic' },
  { label: 'Licensed Indoor', value: 'licensed indoor' },
  { label: 'Mixed Light', value: 'mixed light' },
];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  wholesale_price: '',
  bulk_price: '',
  product_type: 'INDOOR',
  image_url: '',
  video_url: '',
  tags: '',
};

export default function ProductManager() {
  const { products, refreshProducts } = useApp();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });

  // Filter products by selected category tab
  const visibleProducts =
    activeCategory === 'ALL'
      ? products
      : products.filter((p) => p.product_type === activeCategory);

  const openAdd = () => {
    setFormData({
      ...emptyForm,
      product_type: activeCategory === 'ALL' ? 'INDOOR' : activeCategory,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: typeof products[0]) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      description: p.description || '',
      price: String(p.price / 100),
      wholesale_price: String(p.metadata?.wholesale_price || ''),
      bulk_price: String(p.metadata?.bulk_price || ''),
      product_type: p.product_type || 'INDOOR',
      image_url: p.images?.[0] || '',
      video_url: p.metadata?.video_url || '',
      tags: p.tags?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Product name is required');
    if (!formData.price) return toast.error('Price is required');

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        images: formData.image_url ? [formData.image_url] : [],
        product_type: formData.product_type,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        metadata: {
          retail_price: parseFloat(formData.price),
          wholesale_price: parseFloat(formData.wholesale_price || '0'),
          bulk_price: parseFloat(formData.bulk_price || '0'),
          video_url: formData.video_url || null,
        },
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Operation failed');

      toast.success(editingId ? '✅ Product updated!' : '✅ Product added to site!');
      setIsModalOpen(false);
      await refreshProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Product removed');
      await refreshProducts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.value === activeCategory)?.label || 'All Products';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wider">Product Inventory</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Click a category below, then add products — they appear instantly on the main site.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#b8860b]/30 transition-all shrink-0"
        >
          <Plus size={16} />
          Add to {activeCategoryLabel}
        </button>
      </div>

      {/* Category Tabs — same as main site */}
      <div className="flex flex-wrap gap-2 mb-6 p-3 bg-[#0a0800] border border-[#1a1200] rounded-2xl">
        {CATEGORIES.map((cat) => {
          const count =
            cat.value === 'ALL'
              ? products.length
              : products.filter((p) => p.product_type === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.value
                  ? 'bg-[#b8860b] text-black shadow-lg shadow-[#b8860b]/30'
                  : 'bg-[#111] text-zinc-400 border border-[#2a2000] hover:border-[#b8860b]/40 hover:text-[#d6a536]'
              }`}
            >
              {cat.label}
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.value
                    ? 'bg-black/20 text-black'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid for selected category */}
      {visibleProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#0a0800] border border-[#1a1200] rounded-2xl">
          <p className="text-zinc-500 text-sm mb-4">
            No products in <span className="text-[#d6a536] font-bold">{activeCategoryLabel}</span> yet.
          </p>
          <button
            onClick={openAdd}
            className="px-6 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-bold text-xs uppercase tracking-wider transition-all"
          >
            + Add First Product Here
          </button>
        </div>
      ) : (
        <div className="bg-[#0a0800] border border-[#1a1200] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111]/60 text-zinc-500 uppercase text-[10px] font-black tracking-wider border-b border-[#1a1200]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Wholesale</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1200]">
                {visibleProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#0d0a00] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-[#2a2000]"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-[#2a2000] flex items-center justify-center text-zinc-600 text-[9px] font-bold">
                            NO IMG
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{p.name}</p>
                          <p className="text-[11px] text-zinc-500 line-clamp-1 max-w-[200px]">
                            {p.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#1a1200] border border-[#3d2f00] text-[#d6a536]">
                        {p.product_type || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#d6a536]">
                      ${(p.price / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500">
                      {p.metadata?.wholesale_price
                        ? `$${Number(p.metadata.wholesale_price).toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a1200] hover:bg-[#2a2000] text-[#d6a536] text-xs font-bold border border-[#3d2f00] transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 text-red-300 text-xs font-bold border border-red-800/40 transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0800] border border-[#2a2000] w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1200] sticky top-0 bg-[#0a0800] z-10">
              <div>
                <h3 className="text-base font-black uppercase text-white tracking-wider">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  This product will appear on the main site immediately after saving.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Category Selector — prominent at top */}
              <div className="p-4 bg-[#111] border border-[#2a2000] rounded-xl">
                <label className="text-xs uppercase font-black text-[#d6a536] block mb-3 tracking-wider">
                  📂 Product Category (which filter it appears under on the site)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c.value !== 'ALL').map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, product_type: cat.value })}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                        formData.product_type === cat.value
                          ? 'bg-[#b8860b] text-black shadow shadow-[#b8860b]/30'
                          : 'bg-[#1a1200] text-zinc-400 border border-[#2a2000] hover:text-[#d6a536]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Super OG Kush"
                  className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the strain, effects, aroma, quality..."
                  className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors resize-none"
                />
              </div>

              {/* Prices */}
              <div className="p-4 bg-[#0d0a00] border border-[#2a2000] rounded-xl space-y-3">
                <label className="text-xs uppercase font-black text-[#d6a536] block tracking-wider mb-1">
                  💰 Pricing (shown on product page)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                      🚢 Ship Price ($) — shown as &ldquo;$X.XX - Ship&rdquo; *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="925.00"
                      className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-[#d6a536] text-sm font-mono focus:outline-none focus:border-[#b8860b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">
                      📍 In Town Price ($) — shown as &ldquo;$X.XX - In Town&rdquo;
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.wholesale_price}
                      onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                      placeholder="825.00"
                      className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-zinc-300 text-sm font-mono focus:outline-none focus:border-[#b8860b] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">Bulk Price ($) — optional</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.bulk_price}
                    onChange={(e) => setFormData({ ...formData, bulk_price: e.target.value })}
                    placeholder="750.00"
                    className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-zinc-300 text-sm font-mono focus:outline-none focus:border-[#b8860b] transition-colors"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="p-4 bg-[#0d0a00] border border-[#2a2000] rounded-xl space-y-3">
                <div>
                  <label className="text-xs uppercase font-black text-[#d6a536] block mb-1.5 tracking-wider">
                    📸 Product Image URL
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">Paste a direct link to the product photo. This shows in the Image tab on the product page.</p>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors"
                  />
                  {formData.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-xl border border-[#2a2000]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase font-black text-[#d6a536] block mb-1.5 tracking-wider">
                    🎥 Product Video URL
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">Paste a direct link to an MP4 video. It shows when the customer clicks the &ldquo;Video&rdquo; tab on the product page.</p>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://example.com/product-video.mp4"
                    className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors"
                  />
                  {formData.video_url && (
                    <p className="text-[11px] text-green-400 mt-1.5">✓ Video URL set — will show in the Video tab</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs uppercase font-bold text-zinc-400 block mb-1.5">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="indoor, top-shelf, exotic, og"
                  className="w-full bg-[#111] border border-[#2a2000] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#b8860b] transition-colors"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2 border-t border-[#1a1200]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-2.5 rounded-xl bg-[#b8860b] hover:bg-[#d6a536] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#b8860b]/30 transition-all disabled:opacity-60"
                >
                  {submitting
                    ? 'Saving...'
                    : editingId
                    ? '✓ Update Product'
                    : '✓ Add to Site Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
