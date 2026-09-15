// content_bigbasket.js — Runs on bigbasket.com in YOUR browser

(async () => {
  await sleep(3000);
  console.log('[NestBasket] BigBasket scraper started ✅');

  const QUERIES = [
    'milk', 'eggs', 'bread', 'butter', 'paneer', 'curd',
    'tomato', 'onion', 'potato',
    'coke', 'pepsi', 'juice',
    'chips', 'biscuit', 'maggi',
    'atta', 'rice', 'toor dal', 'oil', 'ghee',
    'tea', 'coffee',
  ];

  const allProducts = [];

  for (const q of QUERIES) {
    try {
      const products = await fetchBigBasketSearch(q);
      allProducts.push(...products);
      await sleep(900);
    } catch (e) {
      console.warn(`[NestBasket] BigBasket search failed for "${q}":`, e.message);
    }
  }

  if (allProducts.length > 0) {
    chrome.runtime.sendMessage({
      type: 'PRICE_DATA',
      store: 'bigbasket',
      products: allProducts,
    });
    console.log(`[NestBasket] ✅ Sent ${allProducts.length} BigBasket products to database`);
  }
})();

async function fetchBigBasketSearch(query) {
  const res = await fetch(
    `https://www.bigbasket.com/product/get-products/?slug=${encodeURIComponent(query)}&page=1&tab_type=%5B"listing"%5D`,
    {
      headers: {
        'Accept': 'application/json',
        'x-channel': 'BB-FLUTTER-WEB',
      },
      credentials: 'include',
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  const prods = data?.tab?.[0]?.product_list || [];

  return prods.slice(0, 10).map(p => ({
    name: p.desc || p.name || '',
    price: p.sp || p.mrp || 0,
    mrp: p.mrp || 0,
    unit: p.w || '',
    image: p.pu || p.thumb_image || '',
    url: `https://www.bigbasket.com/pd/${p.id}/${encodeURIComponent((p.desc || '').toLowerCase().replace(/\s+/g, '-'))}/`,
  })).filter(p => p.name && p.price > 0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
