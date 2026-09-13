// NestBasket Affiliate Monetization & Direct Checkout Service
// Automatically appends founder UTM tags, partner commission parameters,
// tracks click-through revenue, and builds multi-store 1-tap checkout links.
// Author: Gopagani Arun (Founder & CEO, NestBasket)

import { PlatformId, CartItem, Product } from '../types';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

export interface AffiliateClickEvent {
  id: string;
  timestamp: string;
  platform: PlatformId;
  productName: string;
  estimatedPrice: number;
  commissionRate: number; // percentage, e.g. 4.5%
  estimatedCommissionRupees: number;
  userId?: string;
  source: 'grid_card' | 'smart_basket' | 'watchlist' | 'telemetry_radar';
}

export interface AffiliateAnalyticsReport {
  totalClicks: number;
  totalEstimatedRevenue: number;
  platformBreakdown: Record<PlatformId, { clicks: number; estimatedRevenue: number }>;
  recentClicks: AffiliateClickEvent[];
}

const AFFILIATE_CLICKS_STORAGE_KEY = 'nestbasket_affiliate_clicks';

// Platform Commission Rates (Standard Indian Quick-Commerce Affiliate Baseline: 3.5% - 5.5%)
export const PLATFORM_COMMISSION_RATES: Record<PlatformId, number> = {
  zepto: 0.045,      // 4.5%
  blinkit: 0.040,    // 4.0%
  instamart: 0.042,  // 4.2%
  bigbasket: 0.050,  // 5.0%
  flipkart: 0.045,   // 4.5%
  amazon: 0.055,     // 5.5%
};

// Store-specific partner referral parameters for Gopagani Arun
const STORE_AFFILIATE_PARAMS: Record<PlatformId, Record<string, string>> = {
  zepto: {
    utm_source: 'nestbasket',
    utm_medium: 'affiliate',
    utm_campaign: 'quick_commerce',
    partner_id: 'NB_ARUN_ZEPTO',
  },
  blinkit: {
    utm_source: 'nestbasket',
    utm_medium: 'affiliate',
    utm_campaign: 'price_comparison',
    ref: 'NB_ARUN_BLINKIT',
  },
  instamart: {
    utm_source: 'nestbasket',
    utm_medium: 'referral',
    utm_campaign: 'smart_basket',
    partner: 'nestbasket_arun',
  },
  bigbasket: {
    utm_source: 'nestbasket',
    utm_medium: 'affiliate',
    utm_campaign: 'bbnow_deals',
    affid: 'NB_ARUN_BB',
  },
  flipkart: {
    affid: 'nestbasket0',
    affExtParam1: 'arun_nestbasket',
  },
  amazon: {
    tag: 'nestbasket0e-21',
    ascsubtag: 'nb_arun_grocery',
  },
};

/**
 * Decorate any store URL with verified founder affiliate tracking tags
 */
export function buildAffiliateUrl(baseUrl: string, platform: PlatformId): string {
  try {
    const parsed = new URL(baseUrl);
    const params = STORE_AFFILIATE_PARAMS[platform] || {};

    Object.entries(params).forEach(([key, val]) => {
      if (!parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, val);
      }
    });

    return parsed.toString();
  } catch (_e) {
    // If invalid URL format, append query parameters manually
    const sep = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${sep}utm_source=nestbasket&ref_founder=gopagani_arun`;
  }
}

/**
 * Log an affiliate click event and compute founder revenue
 */
export function trackAffiliateClick(
  platform: PlatformId,
  productName: string,
  price: number = 60,
  source: 'grid_card' | 'smart_basket' | 'watchlist' | 'telemetry_radar' = 'grid_card',
  userId?: string
): AffiliateClickEvent {
  const rate = PLATFORM_COMMISSION_RATES[platform] || 0.045;
  const estimatedCommission = Math.max(1.5, Math.round(price * rate * 100) / 100);

  const event: AffiliateClickEvent = {
    id: 'CLK-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toISOString(),
    platform,
    productName,
    estimatedPrice: price,
    commissionRate: rate * 100,
    estimatedCommissionRupees: estimatedCommission,
    source,
    userId,
  };

  try {
    const raw = localStorage.getItem(AFFILIATE_CLICKS_STORAGE_KEY);
    const clicks: AffiliateClickEvent[] = raw ? JSON.parse(raw) : [];
    clicks.unshift(event);
    // Keep last 250 clicks
    if (clicks.length > 250) clicks.length = 250;
    localStorage.setItem(AFFILIATE_CLICKS_STORAGE_KEY, JSON.stringify(clicks));
  } catch (_e) {}

  return event;
}

/**
 * Retrieve total affiliate performance analytics for the Founder Dashboard
 */
export function getAffiliateAnalytics(): AffiliateAnalyticsReport {
  try {
    const raw = localStorage.getItem(AFFILIATE_CLICKS_STORAGE_KEY);
    const clicks: AffiliateClickEvent[] = raw ? JSON.parse(raw) : [];

    const breakdown: Record<PlatformId, { clicks: number; estimatedRevenue: number }> = {
      zepto: { clicks: 0, estimatedRevenue: 0 },
      blinkit: { clicks: 0, estimatedRevenue: 0 },
      instamart: { clicks: 0, estimatedRevenue: 0 },
      bigbasket: { clicks: 0, estimatedRevenue: 0 },
      flipkart: { clicks: 0, estimatedRevenue: 0 },
      amazon: { clicks: 0, estimatedRevenue: 0 },
    };

    let totalRevenue = 0;

    clicks.forEach((c) => {
      if (breakdown[c.platform]) {
        breakdown[c.platform].clicks += 1;
        breakdown[c.platform].estimatedRevenue += c.estimatedCommissionRupees;
      }
      totalRevenue += c.estimatedCommissionRupees;
    });

    return {
      totalClicks: clicks.length,
      totalEstimatedRevenue: Math.round(totalRevenue),
      platformBreakdown: breakdown,
      recentClicks: clicks.slice(0, 20),
    };
  } catch (_e) {
    return {
      totalClicks: 0,
      totalEstimatedRevenue: 0,
      platformBreakdown: {} as any,
      recentClicks: [],
    };
  }
}

/**
 * Transfer an entire basket to a specific platform's checkout
 */
export function openPlatformCartCheckout(
  platform: PlatformId,
  items: CartItem[]
): void {
  if (items.length === 0) return;

  // Track the checkout intent for affiliate commissions
  const totalBasketValue = items.reduce((sum, it) => {
    const p = it.product.offers[platform]?.price || it.product.price || 50;
    return sum + p * it.quantity;
  }, 0);

  trackAffiliateClick(
    platform,
    `Multi-Item Basket (${items.length} items)`,
    totalBasketValue,
    'smart_basket'
  );

  // If basket has a primary item, open its direct affiliate page
  const primaryItem = items[0];
  const directUrl = getDirectStoreBuyUrl(
    platform,
    primaryItem.product.name,
    primaryItem.product.offers[platform]?.affiliateUrl,
    primaryItem.product.unit
  );

  const monetizedUrl = buildAffiliateUrl(directUrl, platform);
  window.open(monetizedUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Format a comprehensive WhatsApp grocery order breakdown that users can share or save
 */
export function generateWhatsAppOrderSummary(
  items: CartItem[],
  cheapestStoreName: string,
  totalSaved: number,
  grandTotal: number
): string {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  let text = `🛒 *NestBasket Smart Grocery Order* (${dateStr})
`;
  text += `⚡ *Cheapest Option*: ${cheapestStoreName}
`;
  text += `💰 *Total Savings*: ₹${totalSaved}
`;
  text += `📦 *Estimated Bill*: ₹${grandTotal}

`;
  text += `*Items Breakdown:*
`;

  items.forEach((it, idx) => {
    text += `${idx + 1}. ${it.product.name} (${it.product.unit}) x ${it.quantity}
`;
  });

  text += `
Checked on NestBasket: https://arungopagani.is-a.dev/nestbasket/`;
  return text;
}
