// src/hooks/useLivePrices.ts
// Reads REAL prices saved by the NestBasket Chrome Extension from Firebase
// Extension runs in user's browser → bypasses Cloudflare → saves real prices to Firebase
// This hook reads from Firebase and merges into product cards

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════
// Firebase Realtime Database URL (same as in background.js)
// ═══════════════════════════════════════════════════════════════
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.firebaseio.com';
// ═══════════════════════════════════════════════════════════════

export interface LiveStorePrice {
  name: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  url: string;
  store: string;
  updatedAt: number;
}

// All live prices from Firebase: { blinkit: { product_key: {...} }, zepto: {...}, ... }
export interface AllLivePrices {
  blinkit?: Record<string, LiveStorePrice>;
  zepto?: Record<string, LiveStorePrice>;
  bigbasket?: Record<string, LiveStorePrice>;
  instamart?: Record<string, LiveStorePrice>;
  lastFetched?: number;
}

// Convert product name to Firebase key (same logic as background.js)
function toKey(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
}

// In-memory cache so we don't re-fetch on every render
let memCache: AllLivePrices | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useLivePrices() {
  const [allPrices, setAllPrices] = useState<AllLivePrices>(memCache || {});
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [extensionInstalled, setExtensionInstalled] = useState<boolean | null>(null);

  const fetchAllPrices = useCallback(async () => {
    // Use cache if fresh
    if (memCache && Date.now() - cacheTime < CACHE_TTL) {
      setAllPrices(memCache);
      return;
    }

    setLoading(true);
    try {
      // Fetch all stores at once using Firebase shallow read
      const res = await fetch(`${FIREBASE_URL}/prices.json`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) throw new Error(`Firebase ${res.status}`);

      const data: AllLivePrices = await res.json();
      if (data) {
        memCache = data;
        cacheTime = Date.now();
        setAllPrices(data);
        setLastSync(new Date());
        setExtensionInstalled(true);
      }
    } catch (_) {
      // Firebase not set up yet or no data — graceful no-op
      setExtensionInstalled(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and every 5 minutes
  useEffect(() => {
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, CACHE_TTL);
    return () => clearInterval(interval);
  }, [fetchAllPrices]);

  // Get merged live prices for a specific product across all stores
  const getLivePricesForProduct = useCallback((productName: string) => {
    const key = toKey(productName);
    const result: Record<string, LiveStorePrice | undefined> = {};

    (['blinkit', 'zepto', 'bigbasket', 'instamart'] as const).forEach(store => {
      const storeData = allPrices[store];
      if (storeData) {
        result[store] = storeData[key];
      }
    });

    return result;
  }, [allPrices]);

  // Check if a product has any live price
  const hasLivePrice = useCallback((productName: string) => {
    const prices = getLivePricesForProduct(productName);
    return Object.values(prices).some(p => p && p.price > 0);
  }, [getLivePricesForProduct]);

  return {
    allPrices,
    getLivePricesForProduct,
    hasLivePrice,
    loading,
    lastSync,
    extensionInstalled,
    refresh: fetchAllPrices,
  };
}
