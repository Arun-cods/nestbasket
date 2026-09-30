import { neon } from '@neondatabase/serverless';
import type { VerifiedStoreProduct } from './productIdentity';

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');
  return neon(url);
}

export async function ensureCatalogSchema() {
  const sql = db();
  await sql`CREATE TABLE IF NOT EXISTS nestbasket_products (
    canonical_product_id TEXT NOT NULL,
    store TEXT NOT NULL,
    external_product_id TEXT NOT NULL,
    external_variant_id TEXT NOT NULL DEFAULT '',
    product_url TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    quantity TEXT,
    price NUMERIC(12,2) NOT NULL,
    mrp NUMERIC(12,2),
    in_stock BOOLEAN NOT NULL,
    image_url TEXT,
    verified_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (store, external_product_id, external_variant_id)
  )`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nb_name ON nestbasket_products(name)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_nb_canonical ON nestbasket_products(canonical_product_id)`;
}

export async function upsertVerifiedProducts(products: VerifiedStoreProduct[]) {
  const sql = db();
  await ensureCatalogSchema();
  for (const p of products) {
    await sql`
      INSERT INTO nestbasket_products
      (canonical_product_id, store, external_product_id, external_variant_id, product_url, name, brand, quantity, price, mrp, in_stock, image_url, verified_at)
      VALUES
      (${p.canonicalProductId}, ${p.store}, ${p.externalProductId}, ${p.externalVariantId || ''}, ${p.productUrl}, ${p.name}, ${p.brand}, ${p.quantity}, ${p.price}, ${p.mrp}, ${p.inStock}, ${p.imageUrl}, ${p.verifiedAt})
      ON CONFLICT (store, external_product_id, external_variant_id) DO UPDATE SET
        canonical_product_id=EXCLUDED.canonical_product_id, product_url=EXCLUDED.product_url,
        name=EXCLUDED.name, brand=EXCLUDED.brand, quantity=EXCLUDED.quantity,
        price=EXCLUDED.price, mrp=EXCLUDED.mrp, in_stock=EXCLUDED.in_stock,
        image_url=EXCLUDED.image_url, verified_at=EXCLUDED.verified_at
    `;
  }
  return { persisted: products.length };
}

export async function findPersistedProducts(query: string) {
  const sql = db();
  await ensureCatalogSchema();
  return sql`SELECT * FROM nestbasket_products
    WHERE name ILIKE ${'%' + query + '%'} OR brand ILIKE ${'%' + query + '%'}
    ORDER BY verified_at DESC LIMIT 100`;
}
