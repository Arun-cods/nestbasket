// src/hooks/useLivePrices.ts
// Reads REAL prices from prices.json in the GitHub repo
// Chrome Extension writes prices there → Website reads via raw.githubusercontent.com

import { useState, useEffect, useCallback } from 'react';

// Reads from GitHub repo — free, no database needed!
const PRICES_URL = 'https://raw.githubusercontent.com/Arun-cods/nestbasket/main/prices.json';

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

function toKey(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
}

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
      // Cache-bust every minute so prices stay fresh
      const url = `${PRICES_URL}?t=${Math.floor(Date.now() / 60000)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: AllLivePrices = await res.json();

      if (data && (data.totalProducts || 0) > 0) {
        memCache = data;
        cacheTime = Date.now();
        setAllPrices(data);
        setLastSync(new Date(data.lastUpdated || Date.now()));
        setHasLiveData(true);
      }
    } catch (_) {
      // Not yet populated — silently use static prices
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, CACHE_TTL);
    return () => clearInterval(interval);
  }, [fetchAllPrices]);

  const getLivePricesForProduct = useCallback((productName: string) => {
    const key = toKey(productName);
    const result: Record<string, LiveStorePrice | undefined> = {};
    (['blinkit', 'zepto', 'bigbasket', 'instamart'] as const).forEach(store => {
      const storeData = allPrices[store];
      if (storeData?.[key]) result[store] = storeData[key];
    });
    return result;
  }, [allPrices]);

  return { allPrices, getLivePricesForProduct, loading, lastSync, hasLiveData, refresh: fetchAllPrices };
}
