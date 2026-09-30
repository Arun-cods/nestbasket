import type { VerifiedStoreProduct, NestBasketStore } from './productIdentity';

export interface IngestionResult {
  store: NestBasketStore; received: number; accepted: number; rejected: number;
  products: VerifiedStoreProduct[]; rejectedReasons: string[];
}

export function ingestVerifiedProducts(store: NestBasketStore, rows: unknown[]): IngestionResult {
  const products: VerifiedStoreProduct[] = [];
  const rejectedReasons: string[] = [];
  for (const row of rows) {
    const p = row as Partial<VerifiedStoreProduct> & Record<string, unknown>;
    const id = p.externalProductId ?? p.externalVariantId;
    const url = p.productUrl;
    const price = Number(p.price);
    if (!id) { rejectedReasons.push('missing external product/variant ID'); continue; }
    if (typeof url !== 'string' || !url.startsWith('https://')) { rejectedReasons.push('missing direct HTTPS product URL'); continue; }
    if (!p.name) { rejectedReasons.push('missing product name'); continue; }
    if (!Number.isFinite(price) || price < 0) { rejectedReasons.push('invalid price'); continue; }
    products.push({
      canonicalProductId: p.canonicalProductId || store + ':' + id, store,
      externalProductId: String(p.externalProductId ?? id),
      externalVariantId: p.externalVariantId ? String(p.externalVariantId) : null,
      productUrl: url, name: String(p.name), brand: p.brand ? String(p.brand) : null,
      quantity: p.quantity ? String(p.quantity) : null, price,
      mrp: p.mrp == null ? null : Number(p.mrp), inStock: p.inStock !== false,
      imageUrl: p.imageUrl ? String(p.imageUrl) : null,
      verifiedAt: p.verifiedAt || new Date().toISOString(),
    });
  }
  return { store, received: rows.length, accepted: products.length, rejected: rows.length - products.length, products, rejectedReasons };
}
