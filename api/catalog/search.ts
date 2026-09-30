import { searchAuthorizedFeed } from '../../src/lib/catalog/authorizedFeed';
import type { NestBasketStore } from '../../src/lib/catalog/productIdentity';

const envMap: Record<string, NestBasketStore> = {
  BLINKIT: 'blinkit',
  ZEPTO: 'zepto',
  BIGBASKET: 'bigbasket',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const storeKey = String(req.query?.store ?? '').toUpperCase();
  const query = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
  const store = envMap[storeKey];

  if (!store || !query) {
    return res.status(400).json({ error: 'store must be blinkit, zepto or bigbasket and q is required' });
  }

  const prefix = store.toUpperCase();
  const endpoint = process.env[`${prefix}_CATALOG_ENDPOINT`];
  const auth = process.env[`${prefix}_CATALOG_AUTH`];

  if (!endpoint) {
    return res.status(503).json({
      store,
      error: 'Authorized catalog source is not configured',
    });
  }

  try {
    const products = await searchAuthorizedFeed({
      store,
      endpoint,
      format: 'json',
      authorizationHeader: auth,
    }, query);

    return res.status(200).json({ store, products });
  } catch (error) {
    return res.status(502).json({
      store,
      error: error instanceof Error ? error.message : 'Catalog request failed',
    });
  }
}
