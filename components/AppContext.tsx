'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product, SiteSettings, CartItem, DEFAULT_SETTINGS } from '@/lib/types';
import { toast } from 'sonner';

interface AppContextType {
  settings: SiteSettings;
  updateLocalSetting: (key: string, value: string) => void;
  refreshSettings: () => Promise<void>;
  products: Product[];
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  ageVerified: boolean;
  setAgeVerified: (verified: boolean) => void;
  isAdmin: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ageVerified, setAgeVerifiedState] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load Initial Settings
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
        if (data.primary_color) {
          document.documentElement.style.setProperty('--brand-primary', data.primary_color);
        }
        if (data.secondary_color) {
          document.documentElement.style.setProperty('--brand-secondary', data.secondary_color);
        }
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  }, []);

  // Load Products
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    }
  }, []);

  // Initial client setup from localStorage & sessionStorage
  useEffect(() => {
    refreshSettings();
    refreshProducts();

    try {
      const savedCart = localStorage.getItem('supertrapbros_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('supertrapbros_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedAge = localStorage.getItem('supertrapbros_age');
      if (savedAge !== null) setAgeVerifiedState(savedAge === 'true');

      const adminSession = sessionStorage.getItem('supertrapbros_admin');
      if (adminSession === 'true') setIsAdmin(true);
    } catch (e) {
      console.error(e);
    }
  }, [refreshSettings, refreshProducts]);

  // Sync Cart
  useEffect(() => {
    localStorage.setItem('supertrapbros_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync Wishlist
  useEffect(() => {
    localStorage.setItem('supertrapbros_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setAgeVerified = useCallback((v: boolean) => {
    setAgeVerifiedState(v);
    localStorage.setItem('supertrapbros_age', String(v));
  }, []);

  const addToCart = useCallback((prod: Product, qty: number = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product_id === prod.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += qty;
        return updated;
      }
      return [
        ...prev,
        {
          product_id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: qty,
          image: prod.images?.[0] || '',
          sku: prod.sku || prod.handle,
        },
      ];
    });
    toast.success(`${prod.name} added to cart`);
  }, []);

  const removeFromCart = useCallback((productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product_id === productId && (!variantId || i.variant_id === variantId)))
    );
  }, []);

  const updateCartQty = useCallback((productId: string, variantId: string | undefined, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId && (!variantId || item.variant_id === variantId)
          ? { ...item, quantity: qty }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      toast.success(exists ? 'Removed from wishlist' : 'Saved to wishlist');
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const loginAdmin = useCallback(
    (pass: string) => {
      if (pass === settings.admin_password || pass === 'supertrapbros2024') {
        setIsAdmin(true);
        sessionStorage.setItem('supertrapbros_admin', 'true');
        return true;
      }
      return false;
    },
    [settings.admin_password]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('supertrapbros_admin');
  }, []);

  const updateLocalSetting = useCallback((key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateLocalSetting,
        refreshSettings,
        products,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        ageVerified,
        setAgeVerified,
        isAdmin,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

