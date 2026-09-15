// content_blinkit.js — Runs on blinkit.com in YOUR browser
// Since this runs IN YOUR BROWSER, Cloudflare trusts it 100%
// It calls Blinkit's own internal API with YOUR cookies → gets REAL prices

(async () => {
  // Wait for page to settle
  await sleep(3000);

  console.log('[NestBasket] Blinkit scraper started ✅');

  // Top categories to scrape with their category IDs
  const BLINKIT_CATEGORIES = [
    { name: 'dairy', cid: '16', query: 'milk eggs paneer butter curd ghee' },
    { name: 'veggies', cid: '3', query: 'tomato onion potato carrot capsicum spinach' },
    { name: 'cold_drinks', cid: '4', query: 'coke pepsi juice water soda' },
    { name: 'snacks', cid: '5', query: 'chips biscuit namkeen popcorn' },
    { name: 'instant', cid: '6', query: 'maggi noodles pasta oats cereal' },
    { name: 'atta_rice_dal', cid: '10', query: 'atta rice toor dal moong urad' },
    { name: 'masala_oil', cid: '11', query: 'oil ghee turmeric cumin chilli salt sugar' },
    { name: 'tea_coffee', cid: '9', query: 'tea coffee horlicks bournvita' },
    { name: 'bakery', cid: '8', query: 'bread biscuit cookies cake rusk' },
    { name: 'sauces', cid: '12', query: 'ketchup sauce mayonnaise jam honey peanut butter' },
    { name: 'cleaning', cid: '17', query: 'detergent surf vim harpic lizol' },
    { name: 'personal_care', cid: '18', query: 'shampoo soap facewash toothpaste' },
  ];

  const allProducts = [];

  for (const cat of BLINKIT_CATEGORIES) {
    const queries = cat.query.split(' ');
    for (const q of queries.slice(0, 3)) { // top 3 queries per category
      try {
        const products = await fetchBlinkitSearch(q);
        products.forEach(p => {
          p.category = cat.name;
          allProducts.push(p);
        });
        await sleep(800); // be gentle, avoid rate limiting
      } catch (e) {
        console.warn(`[NestBasket] Blinkit search failed for "${q}":`, e.message);
      }
    }
  }

  if (allProducts.length > 0) {
    chrome.runtime.sendMessage({
      type: 'PRICE_DATA',
      store: 'blinkit',
      products: allProducts,
    });
    console.log(`[NestBasket] ✅ Sent ${allProducts.length} Blinkit products to database`);
  }
})();

// Call Blinkit's internal search API — works because we're IN the user's browser
async function fetchBlinkitSearch(query) {
  const res = await fetch(
    `https://blinkit.com/v6/search/products?q=${encodeURIComponent(query)}&start=0&size=10`,
    {
      headers: {
        'Accept': 'application/json',
        'web_app_version': '1019000',
        'device-id': 'nestbasket-ext-01',
      },
      credentials: 'include', // USE USER'S COOKIES → Cloudflare trusts this
    }
  );

  if (!res.ok) return [];
  const data = await res.json();
  const products = data?.response?.products || data?.products || [];

  return products.map(p => {
    const prid = p.id || p.product_id || '';
    return {
      name: p.name || '',
      price: p.price || p.selling_price || 0,
      mrp: p.mrp_price || p.price || 0,
      unit: p.unit || p.variant_name || '',
      image: prid
        ? `https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/${prid}a.jpg`
        : '',
      url: prid
        ? `https://blinkit.com/prn/${encodeURIComponent((p.name || '').toLowerCase().replace(/\s+/g, '-'))}/prid/${prid}?r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`
        : '',
      prid: String(prid),
    };
  }).filter(p => p.name && p.price > 0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
