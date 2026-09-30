import { CanonicalProduct, VerifiedStoreProduct, canonicalIdentityKey } from './productIdentity';

export interface ComparisonGroup {
  canonical: CanonicalProduct;
  offers: VerifiedStoreProduct[];
}

function scoreMatch(canonical: CanonicalProduct, offer: VerifiedStoreProduct): number {
  const a = canonicalIdentityKey(canonical);
  const b = canonicalIdentityKey({
    brand: offer.brand ?? undefined,
    name: offer.name,
    quantity: offer.quantity ?? undefined,
  });

  if (a === b) return 100;

  const canonicalWords = new Set(a.split('|').join(' ').split(' ').filter(Boolean));
  const offerWords = new Set(b.split('|').join(' ').split(' ').filter(Boolean));
  if (!canonicalWords.size || !offerWords.size) return 0;

  let common = 0;
  for (const word of canonicalWords) if (offerWords.has(word)) common++;
  return Math.round((common / Math.max(canonicalWords.size, offerWords.size)) * 100);
}

export function buildComparison(
  canonical: CanonicalProduct,
  offers: VerifiedStoreProduct[],
): ComparisonGroup {
  const verified = offers
    .filter((offer) => offer.canonicalProductId && offer.externalProductId)
    .map((offer) => ({ offer, score: scoreMatch(canonical, offer) }))
    .filter(({ score }) => score >= 70)
    .sort((a, b) => a.offer.price - b.offer.price);

  return {
    canonical,
    offers: verified.map(({ offer }) => offer),
  };
}

export function lowestVerifiedOffer(group: ComparisonGroup): VerifiedStoreProduct | null {
  return group.offers
    .filter((offer) => offer.inStock && Number.isFinite(offer.price))
    .sort((a, b) => a.price - b.price)[0] ?? null;
}
