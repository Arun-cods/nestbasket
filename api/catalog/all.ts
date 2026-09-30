import { searchAuthorizedFeed } from '../../src/lib/catalog/authorizedFeed';
import { searchFlipkart } from '../../src/lib/storeAdapters/flipkart';

const feedStores = ['blinkit', 'zepto', 'bigbasket'] as const;

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const query = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
  if (!query) return res.status(400).json({ error: 'q is required' });

  const results: any[] = [];
  const errors: Record<string, string> = {};

  await Promise.all(feedStores.map(async (store) => {
    const endpoint = process.env[`${store.toUpperCase()}_CATALOG_ENDPOINT`];
    const authorizationHeader = process.env[`${store.toUpperCase()}_CATALOG_AUTH`];

    if (!endpoint) return;

    try {
      const products = await searchAuthorizedFeed({
        store,
        endpoint,
        format: 'json',
        authorizationHeader,
      }, query);
      results.push(...products);
    } catch (error) {
      errors[store] = error instanceof Error ? error.message : 'request failed';
    }
  }));

  if (process.env.FLIPKART_AFFILIATE_ID && process.env.FLIPKART_AFFILIATE_TOKEN) {
    try {
      results.push(...await searchFlipkart({
        affiliateId: process.env.FLIPKART_AFFILIATE_ID,
        affiliateToken: process.env.FLIPKART_AFFILIATE_TOKEN,
      }, query));
    } catch (error) {
      errors.flipkart = error instanceof Error ? error.message : 'request failed';
    }
  }

  return res.status(200).json({
    query,
    products: results,
    connectedStores: [...new Set(results.map((p) => p.store))],
    errors,
  });
}
