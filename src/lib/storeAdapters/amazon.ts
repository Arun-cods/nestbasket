import { VerifiedStoreProduct } from '../catalog/productIdentity';

export interface AmazonSearchConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  region?: string;
  host?: string;
  marketplace?: string;
}

export interface AmazonSearchAdapter {
  search(query: string): Promise<VerifiedStoreProduct[]>;
}

/**
 * PA-API request signing is intentionally isolated from the browser.
 * Put the signing implementation/server credentials in the Vercel function.
 * Never expose accessKey/secretKey to the React bundle.
 */
export function createAmazonAdapter(_config: AmazonSearchConfig): AmazonSearchAdapter {
  return {
    async search(_query: string): Promise<VerifiedStoreProduct[]> {
      throw new Error('Amazon PA-API signer/server route is required before live requests are enabled');
    },
  };
}