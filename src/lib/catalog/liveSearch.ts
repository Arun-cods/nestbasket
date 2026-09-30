import { VerifiedStoreProduct } from '../catalog/productIdentity';

export async function searchLiveCatalog(query: string): Promise<VerifiedStoreProduct[]> {
  if (!query.trim()) return [];

  const response = await fetch('/api/catalog/all?q=' + encodeURIComponent(query.trim()));
  if (!response.ok) throw new Error('Live catalog search failed');

  const data = await response.json() as { products?: VerifiedStoreProduct[] };
  return data.products ?? [];
}
