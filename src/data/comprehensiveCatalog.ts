import type { Product, PlatformId } from '../types';

/**
 * Static products are intentionally disabled.
 * NestBasket must only display products returned by a connected,
 * authorized store source and validated by the catalog ingestion layer.
 */
export const generateStoreOffers = (
  _basePrice: number,
  _mrp: number,
  _productName: string = '',
): Record<PlatformId, any> => {
  const platforms: PlatformId[] = ['zepto', 'blinkit', 'instamart', 'bigbasket', 'amazon', 'flipkart'];
  return Object.fromEntries(platforms.map((platform) => [
    platform,
    {
      platform,
      price: null,
      mrp: null,
      inStock: false,
      deliveryTimeMin: null,
      surgeFee: null,
      handlingFee: null,
      affiliateUrl: '',
      productUrl: null,
      externalProductId: null,
      externalSlug: null,
      verified: false,
      verificationStatus: 'UNVERIFIED',
      lastVerifiedAt: null,
      storeImageUrl: null,
    },
  ])) as Record<PlatformId, any>;
};

export const MASTER_CATALOG_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🛒', totalSkus: 'Verified only' },
  { id: 'dairy', label: 'Dairy, Bread & Eggs', icon: '🥛', totalSkus: 'Verified only' },
  { id: 'veggies', label: 'Fresh Vegetables & Fruits', icon: '🍅', totalSkus: 'Verified only' },
  { id: 'staples', label: 'Atta, Rice, Dal & Ghee', icon: '🌾', totalSkus: 'Verified only' },
  { id: 'snacks', label: 'Snacks, Biscuits & Munchies', icon: '🍪', totalSkus: 'Verified only' },
  { id: 'beverages', label: 'Tea, Coffee & Cold Drinks', icon: '☕', totalSkus: 'Verified only' },
  { id: 'instant', label: 'Instant Food, Noodles & Sauces', icon: '🍜', totalSkus: 'Verified only' },
  { id: 'household', label: 'Cleaning & Home Essentials', icon: '🧼', totalSkus: 'Verified only' },
  { id: 'personal', label: 'Personal Care & Grooming', icon: '🧴', totalSkus: 'Verified only' },
];

/**
 * Deliberately empty. This prevents historical/demo prices and generic images
 * from reaching the shopper UI as if they were current store data.
 */
export const COMPREHENSIVE_GROCERY_DATA: Product[] = [];
