// NestBasket Darkstore API Client & Telemetry Gateway
// Handles real-time scraping communication with local/edge server
// and seamlessly falls back to Master Catalog Engine if offline.

import { Product, PlatformId } from '../types';
import { queryMasterCatalog } from '../data/masterCatalogEngine';

export interface DarkstoreTelemetryData {
  zeptoPingMs: number;
  blinkitPingMs: number;
  instamartPingMs: number;
  bigbasketPingMs: number;
  flipkartPingMs: number;
}

export interface DarkstoreStoreOffer {
  platform: PlatformId;
  name: string;
  price: number;
  mrp: number;
  inStock: boolean;
  deliveryTimeMin: number;
  handlingFee: number;
  surgeFee: number;
  darkstoreId: string;
  directBuyUrl: string;
}

export interface DarkstoreCompareResult {
  query: string;
  unit: string;
  standardMrp: number;
  cheapestStore: string;
  lowestPrice: number;
  maxSavings: number;
  savingsPercentage: number;
  offers: Record<PlatformId, DarkstoreStoreOffer>;
  timestamp: string;
  pincode: string;
  darkstoreTelemetry: DarkstoreTelemetryData;
  source: 'live-darkstore-api' | 'master-catalog-fallback';
}

export interface StoreSurgeStatus {
  platform: PlatformId;
  name: string;
  logo: string;
  surge: number;
  handlingFee: number;
  deliveryTime: string;
  status: string;
  isSurging: boolean;
  pingMs?: number;
}

export interface SurgeRadarData {
  pincode: string;
  city: string;
  timestamp: string;
  activeStores: StoreSurgeStatus[];
  source: 'live-server' | 'resilient-cache';
}

// In-memory query cache
const memoryCache = new Map<string, { timestamp: number; data: DarkstoreCompareResult }>();
const CACHE_TTL_MS = 45 * 1000; // 45 seconds

// Detect available API server base URL
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return 'http://localhost:3001';
    }
    return '';
  }
  return 'http://localhost:3001';
}

export async function checkDarkstoreServiceHealth(): Promise<{ online: boolean; uptimeSeconds?: number; message?: string }> {
  try {
    const baseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${baseUrl}/api/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, uptimeSeconds: data.uptimeSeconds, message: data.service };
    }
  } catch (_err) {
    // Expected when running frontend standalone
  }
  return { online: false, message: 'Standalone Catalog Engine Active (Fail-Safe)' };
}

export async function fetchSurgeRadar(pincode: string = '500016', city: string = 'hyd'): Promise<SurgeRadarData> {
  try {
    const baseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${baseUrl}/api/surge?pincode=${encodeURIComponent(pincode)}&city=${encodeURIComponent(city)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          ...json.data,
          source: 'live-server',
        };
      }
    }
  } catch (_err) {
    // Fall back to resilient offline snapshot
  }

  return {
    pincode,
    city,
    timestamp: new Date().toISOString(),
    source: 'resilient-cache',
    activeStores: [
      {
        platform: 'zepto',
        name: 'Zepto',
        logo: '⚡',
        surge: 0,
        handlingFee: 4,
        deliveryTime: '8-10 mins',
        status: 'Normal Operations',
        isSurging: false,
        pingMs: 58,
      },
      {
        platform: 'blinkit',
        name: 'Blinkit',
        logo: '🟡',
        surge: 15,
        handlingFee: 5,
        deliveryTime: '12-14 mins',
        status: 'High Local Demand (+₹15)',
        isSurging: true,
        pingMs: 92,
      },
      {
        platform: 'instamart',
        name: 'Swiggy Instamart',
        logo: '🟠',
        surge: 0,
        handlingFee: 6,
        deliveryTime: '15-18 mins',
        status: 'Normal Operations',
        isSurging: false,
        pingMs: 84,
      },
      {
        platform: 'bigbasket',
        name: 'BigBasket Now',
        logo: '🟢',
        surge: 0,
        handlingFee: 3,
        deliveryTime: '18-25 mins',
        status: 'Lowest Fee (₹3)',
        isSurging: false,
        pingMs: 110,
      },
      {
        platform: 'flipkart',
        name: 'Flipkart Minutes',
        logo: '🔵',
        surge: 0,
        handlingFee: 4,
        deliveryTime: '9-12 mins',
        status: '10m Express',
        isSurging: false,
        pingMs: 70,
      },
    ],
  };
}

export async function comparePricesLive(
  query: string,
  options: { pincode?: string; city?: string } = {}
): Promise<DarkstoreCompareResult> {
  const pincode = options.pincode || '500016';
  const city = options.city || 'hyd';
  const cacheKey = `${query.toLowerCase().trim()}_${pincode}`;

  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const baseUrl = getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `${baseUrl}/api/compare?query=${encodeURIComponent(query)}&pincode=${encodeURIComponent(pincode)}&city=${encodeURIComponent(city)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const result: DarkstoreCompareResult = {
          ...json.data,
          source: 'live-darkstore-api',
        };
        memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
        return result;
      }
    }
  } catch (_err) {
    // Fall back to Master Catalog Engine seamlessly
  }

  const catalog = queryMasterCatalog({
    category: 'all',
    searchQuery: query,
    page: 1,
    pageSize: 1,
  });

  const bestProduct: Product | undefined = catalog.items[0];
  const standardMrp = bestProduct?.mrp || bestProduct?.price || 60;
  const storeOffers = bestProduct?.offers;

  const offers: Record<PlatformId, DarkstoreStoreOffer> = {
    zepto: {
      platform: 'zepto',
      name: 'Zepto',
      price: storeOffers?.zepto?.price || Math.round(standardMrp * 0.92),
      mrp: standardMrp,
      inStock: storeOffers?.zepto?.inStock ?? true,
      deliveryTimeMin: 9,
      handlingFee: 4,
      surgeFee: 0,
      darkstoreId: 'ZEP-HYD-04',
      directBuyUrl: `https://www.zeptonow.com/search?q=${encodeURIComponent(query)}`,
    },
    blinkit: {
      platform: 'blinkit',
      name: 'Blinkit',
      price: storeOffers?.blinkit?.price || Math.round(standardMrp * 0.95),
      mrp: standardMrp,
      inStock: storeOffers?.blinkit?.inStock ?? true,
      deliveryTimeMin: 12,
      handlingFee: 5,
      surgeFee: 0,
      darkstoreId: 'BLK-HYD-02',
      directBuyUrl: `https://blinkit.com/s/?q=${encodeURIComponent(query)}`,
    },
    instamart: {
      platform: 'instamart',
      name: 'Swiggy Instamart',
      price: storeOffers?.instamart?.price || Math.round(standardMrp * 0.94),
      mrp: standardMrp,
      inStock: storeOffers?.instamart?.inStock ?? true,
      deliveryTimeMin: 15,
      handlingFee: 6,
      surgeFee: 0,
      darkstoreId: 'SWG-HYD-07',
      directBuyUrl: `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(query)}`,
    },
    bigbasket: {
      platform: 'bigbasket',
      name: 'BigBasket Now',
      price: storeOffers?.bigbasket?.price || Math.round(standardMrp * 0.88),
      mrp: standardMrp,
      inStock: storeOffers?.bigbasket?.inStock ?? true,
      deliveryTimeMin: 22,
      handlingFee: 3,
      surgeFee: 0,
      darkstoreId: 'BB-HYD-01',
      directBuyUrl: `https://www.bigbasket.com/ps/?q=${encodeURIComponent(query)}`,
    },
    flipkart: {
      platform: 'flipkart',
      name: 'Flipkart Minutes',
      price: storeOffers?.flipkart?.price || Math.round(standardMrp * 0.90),
      mrp: standardMrp,
      inStock: storeOffers?.flipkart?.inStock ?? true,
      deliveryTimeMin: 10,
      handlingFee: 4,
      surgeFee: 0,
      darkstoreId: 'FK-HYD-09',
      directBuyUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
    },
    amazon: {
      platform: 'amazon',
      name: 'Amazon Fresh',
      price: storeOffers?.amazon?.price || Math.round(standardMrp * 0.89),
      mrp: standardMrp,
      inStock: storeOffers?.amazon?.inStock ?? true,
      deliveryTimeMin: 120,
      handlingFee: 0,
      surgeFee: 0,
      darkstoreId: 'AMZ-HYD-FC',
      directBuyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
    },
  };

  const validPrices = Object.values(offers).filter((o) => o.inStock).map((o) => o.price);
  const lowestPrice = Math.min(...validPrices);
  const highestPrice = Math.max(...validPrices);
  const maxSavings = highestPrice - lowestPrice;
  const savingsPercentage = Math.round((maxSavings / highestPrice) * 100);

  const cheapestEntry = Object.entries(offers).find(([_, o]) => o.price === lowestPrice);
  const cheapestStore = cheapestEntry ? cheapestEntry[1].name : 'BigBasket Now';

  const result: DarkstoreCompareResult = {
    query,
    unit: bestProduct?.unit || '1 Pack',
    standardMrp,
    cheapestStore,
    lowestPrice,
    maxSavings,
    savingsPercentage,
    offers,
    timestamp: new Date().toISOString(),
    pincode,
    darkstoreTelemetry: {
      zeptoPingMs: 64,
      blinkitPingMs: 98,
      instamartPingMs: 88,
      bigbasketPingMs: 114,
      flipkartPingMs: 72,
    },
    source: 'master-catalog-fallback',
  };

  memoryCache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
}
