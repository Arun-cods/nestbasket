// Vercel Serverless Function: /api/compare
// Fetches REAL LIVE prices from Blinkit, Zepto, BigBasket, Instamart
// for Hyderabad pincode 500016

export default async function handler(req, res) {
  // CORS - allow all origins so the frontend can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    q = 'milk',
    pincode = '500016',
    lat = '17.3850',
    lon = '78.4867',
  } = req.query;

  const query = String(q).trim();
  const results = {};

  // ── 1. BLINKIT ────────────────────────────────────────────────────────────
  try {
    const blinkitRes = await fetch(
      `https://blinkit.com/v6/search/products?q=${encodeURIComponent(query)}&start=0&size=5`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 Chrome/115 Safari/537.36',
          'Accept': 'application/json',
          'gr-lat': lat,
          'gr-lon': lon,
          'gr-pincode': pincode,
          'gr-building-id': '0',
          'gr-city-id': '8',
          'web_app_version': '1019000',
          'device-id': 'nestbasket-hyd-01',
          'Referer': 'https://blinkit.com/',
        },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (blinkitRes.ok) {
      const data = await blinkitRes.json();
      const products = data?.response?.products || data?.products || [];
      if (products.length > 0) {
        const p = products[0];
        const prid = p.id || p.product_id || '';
        results.blinkit = {
          price: p.price || p.mrp_price,
          mrp: p.mrp_price || p.price,
          inStock: true,
          deliveryTimeMin: 12,
          affiliateUrl: `https://blinkit.com/prn/${encodeURIComponent((p.name || query).toLowerCase().replace(/\s+/g, '-'))}/prid/${prid}?r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`,
          image: prid ? `https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/${prid}a.jpg` : null,
          source: 'live',
        };
      }
    }
  } catch (_) {
    // Blinkit fetch failed - will use static fallback
  }

  // ── 2. ZEPTO ──────────────────────────────────────────────────────────────
  try {
    const zeptoRes = await fetch(
      `https://api.zeptonow.com/api/v3/search?query=${encodeURIComponent(query)}&pageNumber=0&pageSize=5&version=6`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 12; Mobile) AppleWebKit/537.36 Chrome/115 Safari/537.36',
          'Accept': 'application/json',
          'app_version': '10.11.1',
          'request_id': `nestbasket_${Date.now()}`,
          'store_id': '39c9ed8a-1ad9-49ae-9e84-1a8ccc5a5bb7',
          'Referer': 'https://www.zeptonow.com/',
        },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (zeptoRes.ok) {
      const data = await zeptoRes.json();
      const items = data?.data?.items || data?.items || [];
      if (items.length > 0) {
        const p = items[0]?.product || items[0];
        const pvid = p.product_variant_id || p.id || '';
        results.zepto = {
          price: Math.round((p.discounted_selling_price || p.selling_price || 0) / 100),
          mrp: Math.round((p.mrp || p.selling_price || 0) / 100),
          inStock: true,
          deliveryTimeMin: 9,
          affiliateUrl: `https://www.zeptonow.com/pn/${encodeURIComponent((p.name || query).toLowerCase().replace(/\s+/g, '-'))}/pvid/${pvid}?r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`,
          source: 'live',
        };
      }
    }
  } catch (_) {
    // Zepto fetch failed - will use static fallback
  }

  // ── 3. BIGBASKET (bbdaily search) ─────────────────────────────────────────
  try {
    const bbRes = await fetch(
      `https://www.bigbasket.com/product/get-products/?slug=${encodeURIComponent(query)}&page=1&tab_type=%5B"listing"%5D&sub_category=&brand=`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/115 Safari/537.36',
          'Accept': 'application/json',
          'x-channel': 'BB-FLUTTER-WEB',
          'Referer': 'https://www.bigbasket.com/',
          'Cookie': `areaCode=${pincode};`,
        },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (bbRes.ok) {
      const data = await bbRes.json();
      const prods = data?.tab?.[0]?.product_list || data?.products || [];
      if (prods.length > 0) {
        const p = prods[0];
        results.bigbasket = {
          price: p.sp || p.mrp,
          mrp: p.mrp,
          inStock: (p.available_qty || 1) > 0,
          deliveryTimeMin: 20,
          affiliateUrl: `https://www.bigbasket.com/pd/${p.id}/${encodeURIComponent((p.desc || query).toLowerCase().replace(/\s+/g, '-'))}/`,
          source: 'live',
        };
      }
    }
  } catch (_) {
    // BigBasket fetch failed
  }

  // ── 4. SWIGGY INSTAMART ───────────────────────────────────────────────────
  try {
    const swiggyRes = await fetch(
      `https://www.swiggy.com/api/instamart/home/search?pageNumber=0&searchResultsOffset=0&limit=5&query=${encodeURIComponent(query)}&ageConsent=false&layoutId=2797&pageType=INSTAMART_SEARCH_PAGE&isPreSearchTag=false&highConfidencePageType=DEFAULT_SEARCH`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/115 Safari/537.36',
          'Accept': 'application/json',
          'content-type': 'application/json',
          'Referer': 'https://www.swiggy.com/instamart',
          'cookie': `_session_tid=nestbasket; userLocation=%7B%22lat%22%3A${lat}%2C%22lng%22%3A${lon}%7D`,
        },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (swiggyRes.ok) {
      const data = await swiggyRes.json();
      const items = data?.data?.widgets?.[0]?.data?.labelSearchData?.restaurants?.[0]?.data?.cards?.[0]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
      const p = items?.[0]?.card?.card?.info;
      if (p) {
        results.instamart = {
          price: Math.round((p.price || p.defaultPrice || 0) / 100),
          mrp: Math.round((p.defaultPrice || p.price || 0) / 100),
          inStock: true,
          deliveryTimeMin: 15,
          affiliateUrl: `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(query)}&r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`,
          source: 'live',
        };
      }
    }
  } catch (_) {
    // Instamart fetch failed
  }

  // Return whatever we got (frontend falls back to static for any missing store)
  return res.status(200).json({
    success: true,
    query,
    pincode,
    fetchedAt: new Date().toISOString(),
    results,
  });
}
