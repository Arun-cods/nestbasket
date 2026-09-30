export type NestBasketStore = 'instamart' | 'blinkit' | 'zepto' | 'bigbasket' | 'amazon' | 'flipkart';

export interface CanonicalProduct {
  id: string;
  brand: string;
  name: string;
  variant?: string;
  quantity?: string;
  unit?: string;
  origin?: string;
  barcode?: string | null;
  canonicalImageUrl?: string | null;
}

export interface VerifiedStoreProduct {
  canonicalProductId: string;
  store: NestBasketStore;
  externalProductId: string;
  externalVariantId?: string | null;
  productUrl: string;
  name: string;
  brand?: string | null;
  quantity?: string | null;
  price: number;
  mrp?: number | null;
  inStock: boolean;
  imageUrl?: string | null;
  verifiedAt: string;
}

export interface ProductIdentityInput {
  brand?: string;
  name: string;
  variant?: string;
  quantity?: string;
  unit?: string;
  origin?: string;
  barcode?: string | null;
}

const normalize = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\\s+/g, ' ');

export function canonicalIdentityKey(product: ProductIdentityInput): string {
  if (product.barcode?.trim()) return `barcode:${normalize(product.barcode)}`;

  return [
    normalize(product.brand),
    normalize(product.name),
    normalize(product.variant),
    normalize(product.quantity),
    normalize(product.unit),
    normalize(product.origin),
  ].filter(Boolean).join('|');
}

export function isVerifiedStoreProduct(product: Partial<VerifiedStoreProduct>): boolean {
  return Boolean(
    product.canonicalProductId &&
    product.store &&
    product.externalProductId &&
    product.productUrl?.startsWith('https://') &&
    product.price != null &&
    product.inStock &&
    product.verifiedAt,
  );
}
