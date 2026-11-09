export interface Product {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  price: number; // in cents
  status: 'active' | 'inactive' | 'draft';
  has_variants: boolean;
  images: string[];
  product_type: string | null;
  tags: string[];
  sku: string | null;
  metadata: {
    retail_price?: number;
    wholesale_price?: number;
    bulk_price?: number;
    video_url?: string | null;
    [key: string]: unknown;
  };
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string | null;
  brand: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  about_text: string;
  admin_password: string;
  store_password: string;
  telegram_link: string;
  phone_number: string;
  email: string;
  bot_checkout_enabled: string;
  btc_enabled: string;
  btc_wallet: string;
  cashapp_enabled: string;
  cashapp_tag: string;
  primary_color: string;
  secondary_color: string;
  currency: string;
  hero_title: string;
  hero_subtitle: string;
  [key: string]: string;
}

export interface Order {
  id: string;
  cart: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  brand: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  variant_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface Package {
  id: string;
  title: string;
  handle: string;
  brand: string;
  sort_order: number;
  created_at: string;
}

export interface AnalyticsEvent {
  id: number;
  brand: string;
  event_type: string;
  event_data: Record<string, unknown>;
  page: string | null;
  session_id: string | null;
  user_agent: string | null;
  country: string | null;
  created_at: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Supertrapbros',
  tagline: 'Premium Selection',
  about_text: 'Welcome to Supertrapbros — your go-to source for premium quality products.',
  admin_password: 'supertrapbros2024',
  store_password: '',
  telegram_link: '',
  phone_number: '',
  email: '',
  bot_checkout_enabled: 'false',
  btc_enabled: 'false',
  btc_wallet: '',
  cashapp_enabled: 'false',
  cashapp_tag: '',
  primary_color: '#b8860b',
  secondary_color: '#d6a536',
  currency: 'USD',
  hero_title: 'Top Shelf',
  hero_subtitle: 'Browse our exclusive catalog of top-shelf products',
  // Product page button labels
  add_to_cart_button_text: 'ADD TO CART',
  buy_telegram_button_text: 'BUY ON TELEGRAM',
  ship_label: 'Ship',
  intown_label: 'In Town',
  telegram_contact_label: 'TELEGRAM',
  local_contact_label: 'LOCAL',
};

