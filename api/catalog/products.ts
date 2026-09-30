import { findPersistedProducts } from '../../src/lib/catalog/productRepository';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const q = typeof req.query?.q === 'string' ? req.query.q.trim() : '';
  if (!q) return res.status(400).json({ error: 'q is required' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'Catalog database is not configured' });
  return res.status(200).json({ products: await findPersistedProducts(q) });
}
