import { VerifiedStoreProduct } from '../catalog/productIdentity';

type FlipkartProduct = {
  productId?: string;
  title?: string;
  productUrl?: string;
  imageUrls?: { value?: string }[];
  imageUrl?: string;
  price?: { sellingPrice?: number; maximumRetailPrice?: number };
  productBaseInfo?: { productIdentifier?: { productId?: string }; productAttributes?: { title?: string; sellingPrice?: number; maximumRetailPrice?: number; imageUrls?: { value?: string }[] } };
};

export interface FlipkartSearchConfig { affiliateId: string; affiliateToken: string; endpoint?: string; }

function mapProduct(p: FlipkartProduct): VerifiedStoreProduct | null {
  const base = p.productBaseInfo?.productAttributes;
  const id = p.productId ?? p.productBaseInfo?.productIdentifier?.productId;
  const name = p.title ?? base?.title;
  const price = p.price?.sellingPrice ?? base?.sellingPrice;
  const mrp = p.price?.maximumRetailPrice ?? base?.maximumRetailPrice;
  const image = p.imageUrl ?? p.imageUrls?.[0]?.value ?? base?.imageUrls?.[0]?.value;
  const url = p.productUrl;
  if (!id || !name || price == null || !url?.startsWith('https://')) return null;
  return { canonicalProductId: 'flipkart:' + id, store: 'flipkart', externalProductId: id, productUrl: url, name, price, mrp: mrp ?? null, inStock: true, imageUrl: image ?? null, verifiedAt: new Date().toISOString() };
}

export async function searchFlipkart(config: FlipkartSearchConfig, query: string): Promise<VerifiedStoreProduct[]> {
  if (!config.affiliateId || !config.affiliateToken) throw new Error('Flipkart Affiliate credentials are required');
  const endpoint = config.endpoint ?? 'https://affiliate-api.flipkart.net/affiliate/1.0/search/json';
  const url = new URL(endpoint); url.searchParams.set('query', query); url.searchParams.set('resultCount', '10');
  const response = await fetch(url, { headers: { 'Fk-Affiliate-Id': config.affiliateId, 'Fk-Affiliate-Token': config.affiliateToken, Accept: 'application/json' } });
  if (!response.ok) throw new Error('Flipkart API failed: HTTP ' + response.status);
  const data = await response.json() as { productInfoList?: FlipkartProduct[]; products?: FlipkartProduct[] };
  return (data.productInfoList ?? data.products ?? []).map(mapProduct).filter(Boolean) as VerifiedStoreProduct[];
}