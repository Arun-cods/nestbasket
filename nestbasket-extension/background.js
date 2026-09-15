// background.js — NestBasket Price Tracker Service Worker
// Saves real prices to prices.json in GitHub repo via GitHub API
// Token is stored locally in chrome.storage — NEVER in the code

const GITHUB_OWNER = 'Arun-cods';
const GITHUB_REPO = 'nestbasket';
const GITHUB_FILE = 'prices.json';
const GITHUB_BRANCH = 'main';

let GITHUB_TOKEN = '';

// Load token from local storage on startup
chrome.storage.local.get(['githubToken'], (data) => {
  if (data.githubToken) GITHUB_TOKEN = data.githubToken;
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_DATA') {
    if (!GITHUB_TOKEN) {
      console.warn('[NestBasket] No token set yet.');
      sendResponse({ success: false, error: 'No token' });
      return true;
    }
    saveToGitHub(message.store, message.products)
      .then((count) => {
        chrome.storage.local.get(['syncCount'], (data) => {
          chrome.storage.local.set({
            syncCount: (data.syncCount || 0) + count,
            lastSync: new Date().toISOString(),
            lastStore: message.store,
          });
        });
        sendResponse({ success: true, count });
      })
      .catch((err) => {
        console.error('[NestBasket] Error:', err.message);
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }

  if (message.type === 'SET_TOKEN') {
    GITHUB_TOKEN = message.token;
    chrome.storage.local.set({ githubToken: message.token, hasToken: true });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['syncCount', 'lastSync', 'lastStore', 'hasToken'], sendResponse);
    return true;
  }
});

async function getCurrentPrices() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}&t=${Date.now()}`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json' },
  });
  if (!res.ok) throw new Error(`GitHub read ${res.status}`);
  const data = await res.json();
  return { content: JSON.parse(atob(data.content.replace(/\n/g, ''))), sha: data.sha };
}

async function saveToGitHub(store, products) {
  if (!products?.length) return 0;
  const { content, sha } = await getCurrentPrices();

  if (!content[store]) content[store] = {};
  for (const p of products) {
    const key = normalizeKey(p.name);
    content[store][key] = {
      name: p.name, price: p.price, mrp: p.mrp || p.price,
      unit: p.unit || '', image: p.image || '', url: p.url || '',
      store, updatedAt: Date.now(),
    };
  }
  content.lastUpdated = new Date().toISOString();
  content.totalProducts = ['blinkit','zepto','bigbasket','instamart']
    .reduce((s, k) => s + Object.keys(content[k] || {}).length, 0);

  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `prices: update ${store} (${products.length} items)`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
      sha, branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) throw new Error(`GitHub write ${res.status}: ${await res.text()}`);
  console.log(`[NestBasket] ✅ Saved ${products.length} ${store} prices`);
  return products.length;
}

function normalizeKey(name) {
  return (name||'').toLowerCase().replace(/[^a-z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'').substring(0,100);
}
