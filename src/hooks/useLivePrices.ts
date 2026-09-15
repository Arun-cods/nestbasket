// src/hooks/useLivePrices.ts
// Reads REAL live prices from Firebase Realtime Database
// Chrome Extension writes real prices there → Website reads them for ALL users

import { useState, useEffect, useCallback } from 'react';

// Your Firebase Realtime Database URL
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.asia-south1.firebasedatabase.app';

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

export interface AllLivePrices {
  blinkit?: Record<string, LiveStorePrice>;
  zepto?: Record<string, LiveStorePrice>;
  bigbasket?: Record<string, LiveStorePrice>;
  instamart?: Record<string, LiveStorePrice>;
}

// Convert product name to the same key format used by the extension
function toKey(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
}

// In-memory cache — avoids re-fetching on every render
let memCache: AllLivePrices | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useLivePrices() {
  const [allPrices, setAllPrices] = useState<AllLivePrices>(memCache || {});
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [hasLiveData, setHasLiveData] = useState(false);

  const fetchAllPrices = useCallback(async () => {
    // Return from in-memory cache if fresh
    if (memCache && Date.now() - cacheTime < CACHE_TTL) {
      setAllPrices(memCache);
      return;
    }

    setLoading(true);
    try {
      // Fetch all store prices from Firebase in one request
      const res = await fetch(`${FIREBASE_URL}/prices.json`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) throw new Error(`Firebase ${res.status}`);

      const data: AllLivePrices = await res.json();

      if (data && typeof data === 'object') {
        // Check if any real prices exist
        const total = Object.values(data)
          .filter(v => typeof v === 'object' && v !== null)
          .reduce((sum, store) => sum + Object.keys(store as object).length, 0);

        if (total > 0) {
          memCache = data;
          cacheTime = Date.now();
          setAllPrices(data);
          setLastSync(new Date());
          setHasLiveData(true);
        }
      }
    } catch (_) {
      // Firebase not yet populated — graceful fallback to static prices
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + every 5 minutes auto-refresh
  useEffect(() => {
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, CACHE_TTL);
    return () => clearInterval(interval);
  }, [fetchAllPrices]);

  // Merge live prices for a specific product from all stores
  const getLivePricesForProduct = useCallback((productName: string) => {
    const key = toKey(productName);
    const result: Record<string, LiveStorePrice | undefined> = {};

    (['blinkit', 'zepto', 'bigbasket', 'instamart'] as const).forEach(store => {
      const storeData = allPrices[store];
      if (storeData && storeData[key]) {
        result[store] = storeData[key];
      }
    });

    return result;
  }, [allPrices]);

  return {
    allPrices,
    getLivePricesForProduct,
    loading,
    lastSync,
    hasLiveData,
    refresh: fetchAllPrices,
  };
}
