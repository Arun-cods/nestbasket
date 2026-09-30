import { ingestVerifiedProducts } from '../../src/lib/catalog/ingestion';
import { upsertVerifiedProducts } from '../../src/lib/catalog/productRepository';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.CATALOG_INGEST_SECRET;
  if (!secret || req.headers.authorization !== 'Bearer ' + secret) return res.status(401).json({ error: 'Unauthorized' });

  const store = String(req.body?.store || '');
  const rows = Array.isArray(req.body?.products) ? req.body.products : [];
  if (!['instamart','blinkit','zepto','bigbasket','amazon','flipkart'].includes(store))
    return res.status(400).json({ error: 'Unsupported store' });

  const result = ingestVerifiedProducts(store as any, rows);
  if (result.products.length && process.env.DATABASE_URL) {
    await upsertVerifiedProducts(result.products);
  }

  return res.status(200).json({
    ...result,
    persisted: Boolean(process.env.DATABASE_URL),
    persistenceRequiredForPermanentSync: !process.env.DATABASE_URL,
  });
}
