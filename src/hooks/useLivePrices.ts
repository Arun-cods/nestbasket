// src/hooks/useLivePrices.ts
// Reads REAL prices from prices.json stored in the GitHub repo
// Chrome Extension writes real prices there → Website reads for free via raw.githubusercontent.com

import { useState, useEffect, useCallback } from 'react';

// Reads directly from the GitHub repo — completely free, no Firebase needed!
const PRICES_URL =
  'https://raw.githubusercontent.com/Arun-cods/nestbasket/main/prices.json';

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
  lastUpdated?: string;
  totalProducts?: number;
}

// Convert product name to storage key (same as extension background.js)
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
    if (memCache && Date.now() - cacheTime < CACHE_TTL) {
      setAllPrices(memCache);
      return;
    }

    setLoading(true);
    try {
      // Add cache-busting to avoid stale GitHub CDN cache
      const url = `${PRICES_URL}?t=${Math.floor(Date.now() / 60000)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: AllLivePrices = await res.json();

      // Check if any real data exists (not just empty objects)
      const totalProducts = data?.totalProducts || 0;
      const dataIsReal = totalProducts > 0;

      if (dataIsReal) {
        memCache = data;
        cacheTime = Date.now();
        setAllPrices(data);
        setLastSync(new Date(data.lastUpdated || Date.now()));
        setHasLiveData(true);
      }
    } catch (_) {
      // prices.json not yet populated — graceful no-op, keep using static prices
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

  // Get live prices for a specific product from all stores
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
