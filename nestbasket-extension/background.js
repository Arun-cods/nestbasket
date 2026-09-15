// background.js — NestBasket Price Tracker Service Worker
// Receives price data from content scripts and saves to Firebase Realtime Database

// ═══════════════════════════════════════════════════════════════
// YOUR FIREBASE REALTIME DATABASE URL
// ═══════════════════════════════════════════════════════════════
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.asia-south1.firebasedatabase.app';
// ═══════════════════════════════════════════════════════════════

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_DATA') {
    saveToFirebase(message.store, message.products)
      .then((count) => {
        chrome.storage.local.get(['syncCount'], (data) => {
          const newCount = (data.syncCount || 0) + count;
          chrome.storage.local.set({
            syncCount: newCount,
            lastSync: new Date().toISOString(),
            lastStore: message.store,
          });
        });
        sendResponse({ success: true, count });
      })
      .catch((err) => {
        console.error('[NestBasket] Firebase save error:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['syncCount', 'lastSync', 'lastStore'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

// Save products to Firebase under /prices/{store}/
async function saveToFirebase(store, products) {
  const update = {};
  for (const p of products) {
    const key = normalizeKey(p.name);
    update[key] = {
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      unit: p.unit || '',
      image: p.image || '',
      url: p.url || '',
      store,
      updatedAt: Date.now(),
    };
  }

  // PATCH = merge, so we don't overwrite other stores
  const url = `${FIREBASE_URL}/prices/${store}.json`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firebase ${res.status}: ${errText}`);
  }

  console.log(`[NestBasket] ✅ Saved ${products.length} ${store} prices to Firebase`);
  return products.length;
}

function normalizeKey(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
}
