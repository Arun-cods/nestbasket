import { VerifiedStoreProduct, NestBasketStore } from '../catalog/productIdentity';

export interface StoreSearchContext {
  query: string;
  locationId?: string;
  page?: number;
}

export interface StoreAdapter {
  store: NestBasketStore;
  search(context: StoreSearchContext): Promise<VerifiedStoreProduct[]>;
}

/**
 * Only adapters with an authorized source should be registered here.
 * A missing adapter must never fall back to fabricated IDs, prices or URLs.
 */
export const storeAdapters: Partial<Record<NestBasketStore, StoreAdapter>> = {};

export function registerStoreAdapter(adapter: StoreAdapter): void {
  storeAdapters[adapter.store] = adapter;
}

export async function searchAllConnectedStores(
  context: StoreSearchContext,
): Promise<VerifiedStoreProduct[]> {
  const adapters = Object.values(storeAdapters).filter(Boolean) as StoreAdapter[];
  const results = await Promise.all(
    adapters.map(async (adapter) => {
      try {
        return await adapter.search(context);
      } catch {
        return [];
      }
    }),
  );

  return results.flat().filter((product) => product.externalProductId && product.productUrl);
}
