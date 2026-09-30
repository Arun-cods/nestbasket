import { searchAuthorizedFeed } from '../../src/lib/catalog/authorizedFeed';
import { searchFlipkart } from '../../src/lib/storeAdapters/flipkart';
import { ingestVerifiedProducts } from '../../src/lib/catalog/ingestion';
import { upsertVerifiedProducts } from '../../src/lib/catalog/productRepository';
import type { NestBasketStore, VerifiedStoreProduct } from '../../src/lib/catalog/productIdentity';

const stores = ['blinkit','zepto','bigbasket'] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const catalogSecret = process.env.CATALOG_REFRESH_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.authorization;
  if ((catalogSecret || cronSecret) && auth !== 'Bearer ' + catalogSecret && auth !== 'Bearer ' + cronSecret) return res.status(401).json({ error: 'Unauthorized' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'DATABASE_URL is not configured' });

  const summary: Record<string, unknown> = {};
  let totalPersisted = 0;

  for (const store of stores) {
    const endpoint = process.env[store.toUpperCase() + '_CATALOG_ENDPOINT'];
    if (!endpoint) { summary[store] = { status: 'NOT_CONFIGURED' }; continue; }
    try {
      const products = await searchAuthorizedFeed({
        store,
        endpoint,
        format: 'json',
        authorizationHeader: process.env[store.toUpperCase() + '_CATALOG_AUTH'],
      }, process.env[store.toUpperCase() + '_CATALOG_REFRESH_QUERY'] || '');
      const accepted = ingestVerifiedProducts(store as NestBasketStore, products).products;
      const persisted = await upsertVerifiedProducts(accepted);
      totalPersisted += persisted.persisted;
      summary[store] = { status: 'UPDATED', received: products.length, persisted: persisted.persisted };
    } catch (error) {
      summary[store] = { status: 'ERROR', error: error instanceof Error ? error.message : 'refresh failed' };
    }
  }

  if (process.env.FLIPKART_AFFILIATE_ID && process.env.FLIPKART_AFFILIATE_TOKEN && process.env.FLIPKART_REFRESH_QUERY) {
    try {
      const products = await searchFlipkart({
        affiliateId: process.env.FLIPKART_AFFILIATE_ID,
        affiliateToken: process.env.FLIPKART_AFFILIATE_TOKEN,
      }, process.env.FLIPKART_REFRESH_QUERY);
      const accepted = ingestVerifiedProducts('flipkart', products).products;
      const persisted = await upsertVerifiedProducts(accepted);
      totalPersisted += persisted.persisted;
      summary.flipkart = { status: 'UPDATED', received: products.length, persisted: persisted.persisted };
    } catch (error) {
      summary.flipkart = { status: 'ERROR', error: error instanceof Error ? error.message : 'refresh failed' };
    }
  } else {
    summary.flipkart = { status: 'NOT_CONFIGURED' };
  }

  return res.status(200).json({ refreshedAt: new Date().toISOString(), totalPersisted, stores: summary });
}
