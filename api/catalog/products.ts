import { findPersistedProducts } from '../../src/lib/catalog/productRepository';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
  if (!q) return res.status(400).json({ error: 'q is required' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'DATABASE_URL is not configured' });
  try {
    const products = await findPersistedProducts(q);
    return res.status(200).json({ products, count: products.length });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Database query failed' });
  }
}
