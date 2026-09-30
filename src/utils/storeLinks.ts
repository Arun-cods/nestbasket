import type { PlatformId } from '../types';

/**
 * Store links are valid only when they come from a verified catalog row.
 * NestBasket never guesses a product URL from a product name.
 */
export function isVerifiedDirectUrl(url?: string | null): boolean {
  if (!url || !url.startsWith('https://')) return false;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return false;
    return !/(^|\/)search(?:\/|\?|$)/i.test(parsed.pathname)
      && !/[?&](?:q|query)=/i.test(parsed.search);
  } catch {
    return false;
  }
}

export function getDirectStoreBuyUrl(
  _platformId: PlatformId,
  _productName: string,
  existingOfferUrl?: string | null,
): string {
  return isVerifiedDirectUrl(existingOfferUrl) ? existingOfferUrl! : '';
}

export function getStoreSearchUrl(_platformId: PlatformId, _productName: string): string {
  // Search URLs are intentionally not used as product links.
  return '';
}

export function isStoreOfferVerified(
  _platformId: PlatformId,
  _productName: string,
  existingOfferUrl?: string | null,
): boolean {
  return isVerifiedDirectUrl(existingOfferUrl);
}

export function getVerifiedStoreUrl(
  _platformId: PlatformId,
  offer?: { externalProductId?: string | null; productUrl?: string | null; verified?: boolean },
): string | null {
  if (!offer?.externalProductId || !offer.verified) return null;
  return isVerifiedDirectUrl(offer.productUrl) ? offer.productUrl! : null;
}

export function getNativeAppIntentUrl(_platformId: PlatformId, _productName: string): string {
  return '';
}
