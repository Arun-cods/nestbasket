import { VerifiedStoreProduct, NestBasketStore } from './productIdentity';

export type FeedFormat = 'json' | 'csv' | 'ndjson';

export interface AuthorizedFeedConfig {
  store: NestBasketStore;
  endpoint: string;
  format: FeedFormat;
  authorizationHeader?: string;
  apiKeyHeader?: string;
  apiKey?: string;
}

function toProduct(row: any, store: NestBasketStore): VerifiedStoreProduct | null {
  const id = row.externalProductId ?? row.productId ?? row.sku ?? row.id;
  const url = row.productUrl ?? row.url;
  const name = row.name ?? row.title;
  const price = Number(row.price);

  if (!id || !name || !url?.startsWith('https://') || !Number.isFinite(price)) return null;

  return {
    canonicalProductId: row.canonicalProductId ?? `${store}:${id}`,
    store,
    externalProductId: String(id),
    externalVariantId: row.variantId ?? row.spinId ?? null,
    productUrl: url,
    name: String(name),
    brand: row.brand ?? null,
    quantity: row.quantity ?? null,
    price,
    mrp: row.mrp == null ? null : Number(row.mrp),
    inStock: row.inStock !== false,
    imageUrl: row.imageUrl ?? row.image ?? null,
    verifiedAt: new Date().toISOString(),
  };
}

export async function searchAuthorizedFeed(
  config: AuthorizedFeedConfig,
  query: string,
): Promise<VerifiedStoreProduct[]> {
  const url = new URL(config.endpoint);
  url.searchParams.set('q', query);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (config.authorizationHeader) headers.Authorization = config.authorizationHeader;
  if (config.apiKeyHeader && config.apiKey) headers[config.apiKeyHeader] = config.apiKey;

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${config.store} feed failed: HTTP ${response.status}`);

  const raw = await response.text();
  const rows = config.format === 'csv'
    ? []
    : config.format === 'ndjson'
      ? raw.split(/\\r?\\n/).filter(Boolean).map((line) => JSON.parse(line))
      : JSON.parse(raw);

  const list = Array.isArray(rows) ? rows : rows.products ?? rows.items ?? rows.data ?? [];
  return list.map((row: any) => toProduct(row, config.store)).filter(Boolean) as VerifiedStoreProduct[];
}
