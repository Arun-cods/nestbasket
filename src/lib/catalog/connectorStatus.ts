import { StoreAdapter } from '../catalog/storeRegistry';
import { NestBasketStore, VerifiedStoreProduct } from '../catalog/productIdentity';

export type ConnectorStatus = 'CONNECTED' | 'AUTH_REQUIRED' | 'NOT_AVAILABLE' | 'ERROR';

export interface ConnectorInfo { store: NestBasketStore; status: ConnectorStatus; source: string; note: string; }

export const connectorStatus: ConnectorInfo[] = [
  { store: 'instamart', status: 'AUTH_REQUIRED', source: 'Swiggy official MCP', note: 'Requires authenticated OAuth and address context.' },
  { store: 'blinkit', status: 'NOT_AVAILABLE', source: 'Authorized partner/catalog source required', note: 'No connector is enabled without an approved source.' },
  { store: 'zepto', status: 'NOT_AVAILABLE', source: 'Authorized partner/catalog source required', note: 'No connector is enabled without an approved source.' },
  { store: 'bigbasket', status: 'NOT_AVAILABLE', source: 'Authorized partner/catalog source required', note: 'No connector is enabled without an approved source.' },
  { store: 'amazon', status: 'AUTH_REQUIRED', source: 'Amazon Product Advertising API', note: 'Requires Associates + PA-API credentials and server-side signing.' },
  { store: 'flipkart', status: 'AUTH_REQUIRED', source: 'Flipkart Affiliate API', note: 'Requires registered affiliate ID and token.' },
];

export function adapterFromSearch(store: NestBasketStore, search: (query: string) => Promise<VerifiedStoreProduct[]>): StoreAdapter {
  return { store, async search(context) { return search(context.query); } };
}