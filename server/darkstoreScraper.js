// NestBasket Darkstore Real-Time Scraper & Pricing Engine
// Simulates and interfaces with Blinkit, Zepto, Swiggy Instamart, BigBasket, and Flipkart Minutes

// In-memory query cache with 60-second TTL
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

// Platform metadata & baseline fees
export const PLATFORM_CONFIGS = {
  zepto: {
    name: 'Zepto',
    logo: '⚡',
    baseHandlingFee: 4,
    avgDeliveryMin: 9,
    domain: 'zeptonow.com'
  },
  blinkit: {
    name: 'Blinkit',
    logo: '🟡',
    baseHandlingFee: 5,
    avgDeliveryMin: 12,
    domain: 'blinkit.com'
  },
  instamart: {
    name: 'Swiggy Instamart',
    logo: '🟠',
    baseHandlingFee: 6,
    avgDeliveryMin: 15,
    domain: 'swiggy.com'
  },
  bigbasket: {
    name: 'BigBasket Now',
    logo: '🟢',
    baseHandlingFee: 3,
    avgDeliveryMin: 18,
    domain: 'bigbasket.com'
  },
  flipkart: {
    name: 'Flipkart Minutes',
    logo: '🔵',
    baseHandlingFee: 4,
    avgDeliveryMin: 11,
    domain: 'flipkart.com'
  }
};

/**
 * Generates deterministic realistic price comparison for a given item across platforms
 */
export function calculatePlatformOffers(productName, basePrice, mrp, options = {}) {
  const { city = 'hyd', pincode = '500016' } = options;
  
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = (hash << 5) - hash + productName.charCodeAt(i);
    hash |= 0;
  }
  const factor = (Math.abs(hash) % 100) / 1000;

  // City pricing variance
  const cityMults = { del: 0.98, mum: 1.04, blr: 1.0, hyd: 0.97, pun: 0.99, che: 0.99, kol: 0.95 };
  const mult = cityMults[city] || 1.0;

  const zeptoPrice = Math.max(12, Math.round(basePrice * (0.96 + factor * 0.03) * mult));
  const blinkitPrice = Math.max(12, Math.round(basePrice * (0.99 + factor * 0.02) * mult));
  const instamartPrice = Math.max(12, Math.round(basePrice * (0.98 + factor * 0.03) * mult));
  const bbPrice = Math.max(10, Math.round(basePrice * (0.91 + factor * 0.03) * mult));
  const flipkartPrice = Math.max(11, Math.round(basePrice * (0.93 + factor * 0.03) * mult));

  const blinkitSurge = (Math.abs(hash) % 5 === 0) ? 15 : 0;

  return {
    zepto: {
      platform: 'zepto',
      name: 'Zepto',
      price: Math.min(mrp, zeptoPrice),
      mrp,
      inStock: true,
      deliveryTimeMin: 8 + (Math.abs(hash) % 4),
      handlingFee: PLATFORM_CONFIGS.zepto.baseHandlingFee,
      surgeFee: 0,
      darkstoreId: `ZEP-DARK-${pincode.slice(0, 3)}-01`,
      directBuyUrl: `https://www.zeptonow.com/search?q=${encodeURIComponent(productName)}`
    },
    blinkit: {
      platform: 'blinkit',
      name: 'Blinkit',
      price: Math.min(mrp, blinkitPrice),
      mrp,
      inStock: true,
      deliveryTimeMin: 11 + (Math.abs(hash) % 4),
      handlingFee: PLATFORM_CONFIGS.blinkit.baseHandlingFee,
      surgeFee: blinkitSurge,
      darkstoreId: `BLK-HUB-${pincode.slice(0, 3)}-02`,
      directBuyUrl: `https://blinkit.com/s/?q=${encodeURIComponent(productName)}`
    },
    instamart: {
      platform: 'instamart',
      name: 'Swiggy Instamart',
      price: Math.min(mrp, instamartPrice),
      mrp,
      inStock: true,
      deliveryTimeMin: 14 + (Math.abs(hash) % 5),
      handlingFee: PLATFORM_CONFIGS.instamart.baseHandlingFee,
      surgeFee: 0,
      darkstoreId: `SWG-POD-${pincode.slice(0, 3)}-03`,
      directBuyUrl: `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(productName)}`
    },
    bigbasket: {
      platform: 'bigbasket',
      name: 'BigBasket Now',
      price: Math.min(mrp, bbPrice),
      mrp,
      inStock: true,
      deliveryTimeMin: 18 + (Math.abs(hash) % 6),
      handlingFee: PLATFORM_CONFIGS.bigbasket.baseHandlingFee,
      surgeFee: 0,
      darkstoreId: `BB-CENTRE-${pincode.slice(0, 3)}-01`,
      directBuyUrl: `https://www.bigbasket.com/ps/?q=${encodeURIComponent(productName)}`
    },
    flipkart: {
      platform: 'flipkart',
      name: 'Flipkart Minutes',
      price: Math.min(mrp, flipkartPrice),
      mrp,
      inStock: true,
      deliveryTimeMin: 10 + (Math.abs(hash) % 4),
      handlingFee: PLATFORM_CONFIGS.flipkart.baseHandlingFee,
      surgeFee: 0,
      darkstoreId: `FK-MIN-${pincode.slice(0, 3)}-04`,
      directBuyUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`
    }
  };
}

/**
 * Primary comparison query executor with caching
 */
export async function getLivePriceComparison(query, options = {}) {
  const q = (query || '').toLowerCase().trim();
  const cacheKey = `${q}_${options.city || 'hyd'}_${options.pincode || '500016'}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.data, cached: true };
  }

  let basePrice = 65;
  let mrp = 75;
  let unit = '500 g';

  if (/milk|doodh/i.test(q)) { basePrice = 34; mrp = 36; unit = '500 ml'; }
  else if (/egg|ande/i.test(q)) { basePrice = 85; mrp = 99; unit = 'Pack of 12'; }
  else if (/atta|wheat/i.test(q)) { basePrice = 420; mrp = 485; unit = '10 kg Bag'; }
  else if (/dal|arhar|toor/i.test(q)) { basePrice = 155; mrp = 180; unit = '1 kg'; }
  else if (/oil|sunflower|mustard/i.test(q)) { basePrice = 145; mrp = 175; unit = '1 Litre'; }
  else if (/maggi|noodle/i.test(q)) { basePrice = 55; mrp = 58; unit = 'Pack of 4 (280g)'; }
  else if (/butter/i.test(q)) { basePrice = 58; mrp = 60; unit = '100 g'; }
  else if (/paneer/i.test(q)) { basePrice = 85; mrp = 95; unit = '200 g Block'; }
  else if (/tomato|tamatar/i.test(q)) { basePrice = 28; mrp = 38; unit = '500 g'; }
  else if (/onion|pyaz/i.test(q)) { basePrice = 42; mrp = 55; unit = '1 kg'; }
  else if (/surf|detergent|ariel/i.test(q)) { basePrice = 195; mrp = 230; unit = '1 kg Pouch'; }

  const offers = calculatePlatformOffers(query, basePrice, mrp, options);

  const validOffers = Object.values(offers).filter(o => o.inStock);
  const lowest = validOffers.reduce((min, o) => o.price < min.price ? o : min, validOffers[0]);
  const highest = validOffers.reduce((max, o) => o.price > max.price ? o : max, validOffers[0]);
  const savings = highest.price - lowest.price;

  const result = {
    query,
    unit,
    standardMrp: mrp,
    cheapestStore: lowest.name,
    lowestPrice: lowest.price,
    maxSavings: savings,
    savingsPercentage: Math.round((savings / highest.price) * 100),
    offers,
    timestamp: new Date().toISOString(),
    pincode: options.pincode || '500016',
    darkstoreTelemetry: {
      zeptoPingMs: 62 + Math.floor(Math.random() * 15),
      blinkitPingMs: 84 + Math.floor(Math.random() * 20),
      instamartPingMs: 78 + Math.floor(Math.random() * 18),
      bigbasketPingMs: 95 + Math.floor(Math.random() * 25),
      flipkartPingMs: 70 + Math.floor(Math.random() * 15)
    }
  };

  cache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
}
