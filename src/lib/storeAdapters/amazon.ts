import { VerifiedStoreProduct } from '../catalog/productIdentity';

export interface AmazonCreatorsConfig {
  credentialId: string;
  credentialSecret: string;
  version: string;
  marketplace?: string;
  endpoint?: string;
}

export interface AmazonCreatorsAdapter {
  search(query: string): Promise<VerifiedStoreProduct[]>;
}

/**
 * Amazon's current supported catalog integration is Creators API.
 * Credentials and OAuth token exchange must stay server-side.
 */
export function createAmazonCreatorsAdapter(
  config: AmazonCreatorsConfig,
): AmazonCreatorsAdapter {
  if (!config.credentialId || !config.credentialSecret || !config.version) {
    throw new Error('Amazon Creators API credentials are required');
  }

  return {
    async search(_query: string): Promise<VerifiedStoreProduct[]> {
      // The exact request/signing/auth flow belongs in the Vercel server
      // integration. Never expose the credential secret to the browser.
      throw new Error(
        'Amazon Creators API server operation must be enabled with approved credentials',
      );
    },
  };
}
