export interface OzonProduct {
  id: string;
  sku: string;
  title: string;
  price: number;
  oldPrice?: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  url: string;
  category: string;
  brand: string;
  description: string;
  characteristics: Record<string, string>;
  packageContents: string[]; // Комплектация
  photos: string[]; // Ссылки на все фото (каждая отдельно)
  tier: string; // Ценовой диапазон
  color?: string;
  dimensions?: string;
  inStock?: boolean;
  stockCount?: number;
  warehouse?: string;
  source?: 'public_catalog' | 'seller_api' | 'deep_collector' | 'search_parser';
  storeName?: string;
  storeUrl?: string;
}

export interface SearchFilter {
  query: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'rating';
}

export interface BatchStoreItem {
  id: string;
  url: string;
  label: string;
  storeName?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  itemCount?: number;
  errorMessage?: string;
}

export interface CatalogPreset {
  id: string;
  label: string;
  priceRange: string;
  url: string;
  count: number;
  badge: string;
}

export type ParseStatus = 'idle' | 'parsing' | 'completed' | 'error';

export interface ParseProgress {
  currentStep: string;
  percent: number;
  totalItems: number;
  processedItems: number;
  currentUrl?: string;
}

export interface SellerApiCredentials {
  clientId: string;
  apiKey: string;
  shopName: string;
  isConnected: boolean;
  lastSync?: string;
}
