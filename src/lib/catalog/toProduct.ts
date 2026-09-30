import type { Product, PlatformId, StoreOffer } from '../../types';
import type { VerifiedStoreProduct } from './productIdentity';

const PLATFORMS: PlatformId[] = ['blinkit','zepto','instamart','bigbasket','amazon','flipkart'];

export function verifiedRowsToProducts(rows: VerifiedStoreProduct[]): Product[] {
  const groups = new Map<string, VerifiedStoreProduct[]>();
  for (const row of rows) {
    const key = row.canonicalProductId || row.externalProductId;
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  return [...groups.values()].map((group) => {
    const first = group[0];
    const offers = Object.fromEntries(PLATFORMS.map((platform) => {
      const row = group.find((item) => item.store === platform);
      const offer: StoreOffer = {
        platform,
        price: row?.price ?? 0,
        mrp: row?.mrp ?? row?.price ?? 0,
        inStock: Boolean(row?.inStock),
        deliveryTimeMin: 0,
        surgeFee: 0,
        handlingFee: 0,
        affiliateUrl: row?.productUrl ?? '',
        productUrl: row?.productUrl ?? null,
        externalProductId: row?.externalProductId ?? null,
        verified: Boolean(row),
        verificationStatus: row ? 'VERIFIED' : 'UNVERIFIED',
        lastVerifiedAt: row?.verifiedAt ?? null,
        storeImageUrl: row?.imageUrl ?? null,
      };
      return [platform, offer];
    })) as Record<PlatformId, StoreOffer>;

    return {
      id: first.canonicalProductId,
      name: first.name,
      brand: first.brand ?? 'Unknown',
      category: 'all',
      unit: first.quantity ?? '',
      imageUrl: first.imageUrl ?? '',
      canonicalImageUrl: first.imageUrl ?? undefined,
      barcode: undefined,
      offers,
    };
  });
}
