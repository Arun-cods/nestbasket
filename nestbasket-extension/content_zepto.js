// content_zepto.js — Runs on zeptonow.com in YOUR browser
// Uses Zepto's internal API with YOUR session cookies → REAL prices

(async () => {
  await sleep(3000);
  console.log('[NestBasket] Zepto scraper started ✅');

  const QUERIES = [
    'milk', 'eggs', 'bread', 'butter', 'paneer', 'curd',
    'tomato', 'onion', 'potato', 'carrot',
    'coke', 'pepsi', 'juice',
    'chips', 'biscuit', 'maggi',
    'atta', 'rice', 'dal', 'oil', 'ghee',
    'tea', 'coffee', 'shampoo', 'soap', 'detergent',
  ];

  const allProducts = [];

  for (const q of QUERIES) {
    try {
      const products = await fetchZeptoSearch(q);
      allProducts.push(...products);
      await sleep(700);
    } catch (e) {
      console.warn(`[NestBasket] Zepto search failed for "${q}":`, e.message);
    }
  }

  if (allProducts.length > 0) {
    chrome.runtime.sendMessage({
      type: 'PRICE_DATA',
      store: 'zepto',
      products: allProducts,
    });
    console.log(`[NestBasket] ✅ Sent ${allProducts.length} Zepto products to database`);
  }
})();

async function fetchZeptoSearch(query) {
  const res = await fetch(
    `https://api.zeptonow.com/api/v3/search?query=${encodeURIComponent(query)}&pageNumber=0&pageSize=10&version=6`,
    {
      headers: {
        'Accept': 'application/json',
        'app_version': '10.11.1',
      },
      credentials: 'include', // USE USER'S COOKIES
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  const items = data?.data?.items || data?.items || [];

  return items.map(item => {
    const p = item?.product || item;
    const pvid = p.product_variant_id || p.id || '';
    const price = Math.round((p.discounted_selling_price || p.selling_price || 0) / 100);
    const mrp = Math.round((p.mrp || p.selling_price || 0) / 100);

    return {
      name: p.name || '',
      price,
      mrp,
      unit: p.quantity || p.unit_quantity || '',
      image: p.image_url || p.images?.[0] || '',
      url: pvid
        ? `https://www.zeptonow.com/pn/${encodeURIComponent((p.name || '').toLowerCase().replace(/\s+/g, '-'))}/pvid/${pvid}?r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`
        : `https://www.zeptonow.com/search?q=${encodeURIComponent(query)}&r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`,
    };
  }).filter(p => p.name && p.price > 0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
