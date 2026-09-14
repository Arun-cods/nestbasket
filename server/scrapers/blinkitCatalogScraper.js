// NestBasket Blinkit Darkstore Catalog Scraper & Direct SKU Ingestion Engine
// Author: Gopagani Arun (NestBasket Founder)
// Automatically crawls all 20 categories, extracts direct /prid/ links, authentic Grofers packshots,
// and decorates all checkout URLs with EarnKaro Publisher ID: 1806075.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const EARNKARO_PUBLISHER_ID = '1806075';

export const BLINKIT_CATEGORIES = [
  { id: 'paan', name: 'Paan Corner', cid: 175 },
  { id: 'dairy', name: 'Dairy, Bread & Eggs', cid: 14 },
  { id: 'veggies', name: 'Fruits & Vegetables', cid: 1487 },
  { id: 'cold_drinks', name: 'Cold Drinks & Juices', cid: 332 },
  { id: 'snacks', name: 'Snacks & Munchies', cid: 1237 },
  { id: 'instant', name: 'Breakfast & Instant Food', cid: 15 },
  { id: 'sweet_tooth', name: 'Sweet Tooth', cid: 9 },
  { id: 'bakery', name: 'Bakery & Biscuits', cid: 888 },
  { id: 'tea_coffee', name: 'Tea, Coffee & Milk Drinks', cid: 12 },
  { id: 'atta_rice_dal', name: 'Atta, Rice & Dal', cid: 16 },
  { id: 'masala_oil', name: 'Masala, Oil & More', cid: 1557 },
  { id: 'sauces', name: 'Sauces & Spreads', cid: 972 },
  { id: 'meat_fish', name: 'Chicken, Meat & Fish', cid: 4 },
  { id: 'organic_healthy', name: 'Organic & Healthy Living', cid: 705 },
  { id: 'baby_care', name: 'Baby Care', cid: 7 },
  { id: 'pharma_wellness', name: 'Pharma & Wellness', cid: 287 },
  { id: 'cleaning', name: 'Cleaning Essentials', cid: 18 },
  { id: 'home_office', name: 'Home & Office', cid: 1379 },
  { id: 'personal_care', name: 'Personal Care', cid: 163 },
  { id: 'pet_care', name: 'Pet Care', cid: 5 }
];

export function decorateWithEarnKaro(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.set('r', EARNKARO_PUBLISHER_ID);
    parsed.searchParams.set('earnkaro_uid', EARNKARO_PUBLISHER_ID);
    parsed.searchParams.set('utm_source', 'nestbasket');
    parsed.searchParams.set('ref_founder', 'gopagani_arun');
    return parsed.toString();
  } catch (e) {
    const sep = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${sep}r=${EARNKARO_PUBLISHER_ID}&earnkaro_uid=${EARNKARO_PUBLISHER_ID}&utm_source=nestbasket&ref_founder=gopagani_arun`;
  }
}

export function cleanProductTitle(rawName) {
  if (!rawName) return '';
  return rawName
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses products from raw category markup or API responses
 */
export function extractProductsFromBlinkitPayload(items, categoryId = 'veggies') {
  if (!Array.isArray(items)) return [];

  return items.map((item, idx) => {
    const prid = item.prid || item.product_id || (item.url && item.url.match(/\/prid\/([0-9a-zA-Z_-]+)/)?.[1]) || `${categoryId}_${idx}`;
    const cleanName = cleanProductTitle(item.name || item.text || 'Grocery Product');
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const directSkuUrl = `https://blinkit.com/prn/${slug}/prid/${prid}`;
    const affiliateUrl = decorateWithEarnKaro(directSkuUrl);
    const imageUrl = item.image || `https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/${prid}a.jpg`;

    const price = Number(item.price) || 45;
    const mrp = Number(item.mrp) || Math.round(price * 1.15);

    return {
      id: `nb_${categoryId}_${prid}`,
      name: item.name || cleanName,
      nameHindi: item.nameHindi || '',
      brand: item.brand || cleanName.split(' ')[0] || 'NestBasket',
      category: categoryId,
      subCategory: item.subCategory || 'Daily Essentials',
      unit: item.unit || item.packSize || '1 unit',
      imageUrl,
      directSkuUrl,
      affiliateUrl,
      price,
      mrp,
      inStock: item.inStock !== false,
      lastSyncedAt: new Date().toISOString()
    };
  });
}

/**
 * Loads pre-extracted authentic Blinkit links from the conversation transcript
 */
export function loadExtractedUserLinks() {
  const extractedPath = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\52e5becc-4df0-4654-894b-d7af29284b26\\scratch\\all_extracted_user_links.json';
  if (!fs.existsSync(extractedPath)) return [];
  try {
    const raw = fs.readFileSync(extractedPath, 'utf8');
    const links = JSON.parse(raw);
    const pridMap = new Map();

    links.forEach(l => {
      const match = l.url && l.url.match(/\/prid\/([0-9a-zA-Z_-]+)/);
      if (match && !pridMap.has(match[1])) {
        pridMap.set(match[1], {
          prid: match[1],
          name: l.text,
          url: l.url
        });
      }
    });

    return Array.from(pridMap.values());
  } catch (e) {
    console.error('Error loading extracted user links:', e);
    return [];
  }
}
