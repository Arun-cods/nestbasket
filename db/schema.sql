CREATE TABLE IF NOT EXISTS nestbasket_products (
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
);

CREATE INDEX IF NOT EXISTS idx_nestbasket_products_canonical
  ON nestbasket_products(canonical_product_id);

CREATE INDEX IF NOT EXISTS idx_nestbasket_products_name
  ON nestbasket_products(name);
