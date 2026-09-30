import { neon } from '@neondatabase/serverless';
import type { VerifiedStoreProduct } from './productIdentity';

export async function upsertVerifiedProducts(products: VerifiedStoreProduct[]) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required for persistent catalog storage');

  const sql = neon(databaseUrl);
  for (const p of products) {
    await sql`
      INSERT INTO nestbasket_products
      (canonical_product_id, store, external_product_id, external_variant_id, product_url,
       name, brand, quantity, price, mrp, in_stock, image_url, verified_at)
      VALUES
      (${p.canonicalProductId}, ${p.store}, ${p.externalProductId}, ${p.externalVariantId},
       ${p.productUrl}, ${p.name}, ${p.brand}, ${p.quantity}, ${p.price}, ${p.mrp},
       ${p.inStock}, ${p.imageUrl}, ${p.verifiedAt})
      ON CONFLICT (store, external_product_id, external_variant_id)
      DO UPDATE SET
        canonical_product_id = EXCLUDED.canonical_product_id,
        product_url = EXCLUDED.product_url,
        name = EXCLUDED.name,
        brand = EXCLUDED.brand,
        quantity = EXCLUDED.quantity,
        price = EXCLUDED.price,
        mrp = EXCLUDED.mrp,
        in_stock = EXCLUDED.in_stock,
        image_url = EXCLUDED.image_url,
        verified_at = EXCLUDED.verified_at
    `;
  }
  return { persisted: products.length };
}

export async function findPersistedProducts(query: string) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return [];
  const sql = neon(databaseUrl);
  return sql`
    SELECT * FROM nestbasket_products
    WHERE name ILIKE ${'%' + query + '%'}
       OR brand ILIKE ${'%' + query + '%'}
    ORDER BY verified_at DESC
    LIMIT 100
  `;
}
