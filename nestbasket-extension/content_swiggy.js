// content_swiggy.js — Runs on swiggy.com (Instamart) in YOUR browser

(async () => {
  await sleep(3000);
  console.log('[NestBasket] Swiggy Instamart scraper started ✅');

  const QUERIES = [
    'milk', 'eggs', 'bread', 'butter', 'paneer', 'curd',
    'tomato', 'onion', 'potato',
    'coke', 'juice', 'chips', 'biscuit', 'maggi',
    'atta', 'rice', 'dal', 'oil', 'tea',
  ];

  const allProducts = [];

  for (const q of QUERIES) {
    try {
      const products = await fetchInstamartSearch(q);
      allProducts.push(...products);
      await sleep(800);
    } catch (e) {
      console.warn(`[NestBasket] Instamart search failed for "${q}":`, e.message);
    }
  }

  if (allProducts.length > 0) {
    chrome.runtime.sendMessage({
      type: 'PRICE_DATA',
      store: 'instamart',
      products: allProducts,
    });
    console.log(`[NestBasket] ✅ Sent ${allProducts.length} Instamart products to database`);
  }
})();

async function fetchInstamartSearch(query) {
  const res = await fetch(
    `https://www.swiggy.com/api/instamart/home/search?pageNumber=0&limit=10&query=${encodeURIComponent(query)}&layoutId=2797&pageType=INSTAMART_SEARCH_PAGE`,
    {
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!res.ok) return [];

  const data = await res.json();

  // Navigate Swiggy's nested response structure
  const widgets = data?.data?.widgets || [];
  const products = [];

  for (const widget of widgets) {
    const cards = widget?.data?.labelSearchData?.restaurants?.[0]?.data?.cards
      || widget?.gridElements?.infoWithStyle?.items
      || [];

    for (const card of cards) {
      const info = card?.card?.card?.info || card?.info || card;
      if (info?.name && info?.price) {
        const price = Math.round((info.price || info.defaultPrice || 0) / 100);
        const mrp = Math.round((info.defaultPrice || info.price || 0) / 100);
        products.push({
          name: info.name,
          price,
          mrp,
          unit: info.itemAttribute?.portionSize || '',
          image: `https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300/${info.imageId || ''}`,
          url: `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(query)}&r=1806075&earnkaro_uid=1806075&utm_source=nestbasket`,
        });
      }
    }
  }

  return products.filter(p => p.name && p.price > 0).slice(0, 10);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
