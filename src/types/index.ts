export type PlatformId = 'blinkit' | 'zepto' | 'instamart' | 'bigbasket' | 'amazon' | 'flipkart';

export interface PlatformMetadata {
  id: PlatformId;
  name: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  logo: string;
  baseDeliveryFee: number;
  freeDeliveryAbove: number;
  handlingFee: number;
  avgDeliveryMin: number;
}

export type VerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'NOT_FOUND' | 'OUT_OF_STOCK' | 'LOCATION_REQUIRED' | 'BROKEN';

export interface StoreOffer {
  platform: PlatformId;
  price: number;
  mrp: number;
  inStock: boolean;
  deliveryTimeMin: number;
  surgeFee: number;
  handlingFee: number;
  affiliateUrl: string;
  productUrl?: string | null;
  externalProductId?: string | null;
  externalSlug?: string | null;
  verified?: boolean;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string | null;
  storeImageUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  nameHindi?: string;
  brand: string;
  category: 'dairy' | 'veggies' | 'staples' | 'snacks' | 'household' | 'festive' | string;
  unit: string;
  imageUrl: string;
  canonicalImageUrl?: string;
  barcode?: string;
  quantityValue?: number;
  quantityUnit?: string;
  price?: number;
  mrp?: number;
  trending?: boolean;
  isDailyEssential?: boolean;
  sponsored?: {
    brandName: string;
    tagline: string;
  };
  offers: Record<PlatformId, StoreOffer>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  preferredPlatform?: PlatformId | 'smart-cheapest';
}

export interface CityOption {
  id: string;
  name: string;
  state: string;
  pincode: string;
  popularAreas: string[];
  lat?: number;
  lon?: number;
}

export interface FounderProfile {
  name: string;
  role: string;
  phone: string;
  email: string;
  aadhaarMasked: string;
  isKycVerified: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  society: string;
  lifetimeSavingsRupees: number;
  isPro: boolean;
  isFounder?: boolean;
  aadhaarMasked?: string;
}

export interface BankPayoutDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
  upiId: string;
  status: 'active_verified' | 'pending';
  pendingSettlementAmount: number;
  totalSettledToDate: number;
}

export interface FounderStats {
  dailyActiveUsers: number;
  totalRupeesSavedToday: number;
  affiliateClicksToday: number;
  estimatedAffiliateRevenue: number;
  sponsoredAdRevenue: number;
  proSubscribers: number;
  whatsappSharesCount: number;
  potentialValuationCr: number;
  affiliateCommissionRate: number; // percentage (e.g. 4.5%)
  proPlanPrice: number; // INR (e.g. 49)
  autoSyncActive: boolean;
  activeCitiesCount: number;
  founderProfile: FounderProfile;
  bankPayoutDetails: BankPayoutDetails;
}

export interface CustomerProblemTicket {
  id: string; // e.g. 'PRB-9201'
  timestamp: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  society?: string;
  category: 'Price Mismatch' | 'Buy Link Broken' | 'OTP / Login' | 'Missing Item' | 'New Store Request' | 'App Bug' | 'Other';
  storeAffected?: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  ownerNotes?: string;
  resolvedAt?: string;
}

