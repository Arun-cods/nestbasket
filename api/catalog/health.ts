import { ensureCatalogSchema } from '../../src/lib/catalog/productRepository';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!process.env.DATABASE_URL) return res.status(503).json({ database: 'NOT_CONFIGURED' });
  try {
    await ensureCatalogSchema();
    return res.status(200).json({ database: 'CONNECTED', catalog: 'READY' });
  } catch (error) {
    return res.status(500).json({ database: 'ERROR', error: error instanceof Error ? error.message : 'Database error' });
  }
}
