import { searchFlipkart } from '../../src/lib/storeAdapters/flipkart';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const query = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
  if (!query) return res.status(400).json({ error: 'q is required' });
  if (!process.env.FLIPKART_AFFILIATE_ID || !process.env.FLIPKART_AFFILIATE_TOKEN) {
    return res.status(503).json({ error: 'Flipkart connector requires server-side affiliate credentials' });
  }
  try {
    const products = await searchFlipkart({ affiliateId: process.env.FLIPKART_AFFILIATE_ID, affiliateToken: process.env.FLIPKART_AFFILIATE_TOKEN }, query);
    return res.status(200).json({ store: 'flipkart', products });
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Flipkart request failed' });
  }
}