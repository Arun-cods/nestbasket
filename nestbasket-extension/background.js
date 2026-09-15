// background.js — NestBasket Price Tracker Service Worker
// Receives price data from content scripts and saves to Firebase Realtime Database

// ═══════════════════════════════════════════════════════════════
// 🔴 YOUR FIREBASE CONFIG — Replace with your Firebase project
// ═══════════════════════════════════════════════════════════════
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.firebaseio.com';
// ═══════════════════════════════════════════════════════════════

let syncCount = 0;
let lastSync = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_DATA') {
    saveToFirebase(message.store, message.products)
      .then(() => {
        syncCount += message.products.length;
        lastSync = new Date().toISOString();
        chrome.storage.local.set({ syncCount, lastSync, lastStore: message.store });
        sendResponse({ success: true });
      })
      .catch((err) => {
        console.error('[NestBasket] Firebase save error:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // keep channel open for async
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['syncCount', 'lastSync', 'lastStore'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

// Save products array to Firebase under /prices/{store}/
async function saveToFirebase(store, products) {
  // Convert to object keyed by normalized product name
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
      store: store,
      updatedAt: Date.now(),
    };
  }

  const url = `${FIREBASE_URL}/prices/${store}.json`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });

  if (!res.ok) {
    throw new Error(`Firebase HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// Normalize product name to a safe Firebase key
function normalizeKey(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 100);
}
