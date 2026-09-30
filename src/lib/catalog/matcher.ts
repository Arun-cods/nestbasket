import { CanonicalProduct, ProductIdentityInput, canonicalIdentityKey } from './productIdentity';

export function findCanonicalProduct(
  input: ProductIdentityInput,
  catalog: CanonicalProduct[],
): CanonicalProduct | undefined {
  const barcode = input.barcode?.trim();
  if (barcode) {
    return catalog.find((p) => p.barcode === barcode);
  }

  const key = canonicalIdentityKey(input);
  return catalog.find((p) => canonicalIdentityKey(p) === key);
}

export function groupStoreProducts(
  products: ProductIdentityInput[],
): Map<string, ProductIdentityInput[]> {
  const groups = new Map<string, ProductIdentityInput[]>();

  for (const product of products) {
    const key = canonicalIdentityKey(product);
    const existing = groups.get(key) ?? [];
    existing.push(product);
    groups.set(key, existing);
  }

  return groups;
}
