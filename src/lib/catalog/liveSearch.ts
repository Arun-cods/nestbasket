import { VerifiedStoreProduct } from '../catalog/productIdentity';

export async function searchLiveCatalog(query: string): Promise<VerifiedStoreProduct[]> {
  if (!query.trim()) return [];

  const response = await fetch('/api/catalog/all?q=' + encodeURIComponent(query.trim()));
  if (!response.ok) throw new Error('Live catalog search failed');

  const data = await response.json() as { products?: VerifiedStoreProduct[] };
  return data.products ?? [];
}


export async function searchPersistedCatalog(query: string): Promise<VerifiedStoreProduct[]> {
  if (!query.trim()) return [];
  const response = await fetch('/api/catalog/products?q=' + encodeURIComponent(query.trim()));
  if (!response.ok) throw new Error('Verified catalog search failed');
  const data = await response.json() as { products?: VerifiedStoreProduct[] };
  return (data.products ?? []).filter((product) =>
    Boolean(product.externalProductId) &&
    /^https:\/\//i.test(product.productUrl) &&
    Number.isFinite(Number(product.price))
  );
}
