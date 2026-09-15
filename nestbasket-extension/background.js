// background.js — NestBasket Price Tracker Service Worker
// Saves real prices to GitHub repo (prices.json) using GitHub API
// NestBasket website reads from raw.githubusercontent.com — completely free!

// ═══════════════════════════════════════════════════════════════
// GITHUB CONFIG — No changes needed, already set for your repo
// ═══════════════════════════════════════════════════════════════
const GITHUB_OWNER = 'Arun-cods';
const GITHUB_REPO = 'nestbasket';
const GITHUB_FILE = 'prices.json';
const GITHUB_BRANCH = 'main';
// Your GitHub Personal Access Token — stored securely in extension storage
// Set via popup: click extension icon → "Set GitHub Token"
// ═══════════════════════════════════════════════════════════════

let GITHUB_TOKEN = '';

// Load token from storage on startup
chrome.storage.local.get(['githubToken', 'syncCount', 'lastSync'], (data) => {
  if (data.githubToken) GITHUB_TOKEN = data.githubToken;
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PRICE_DATA') {
    saveToGitHub(message.store, message.products)
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
        console.error('[NestBasket] GitHub save error:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }

  if (message.type === 'SET_TOKEN') {
    GITHUB_TOKEN = message.token;
    chrome.storage.local.set({ githubToken: message.token });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['syncCount', 'lastSync', 'lastStore', 'githubToken'], (data) => {
      sendResponse({ ...data, hasToken: !!data.githubToken });
    });
    return true;
  }
});

// ── Read current prices.json from GitHub ──────────────────────
async function getCurrentPrices() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(atob(data.content.replace(/\n/g, '')));
  return { content, sha: data.sha };
}

// ── Save products to GitHub prices.json ───────────────────────
async function saveToGitHub(store, products) {
  if (!GITHUB_TOKEN) {
    console.warn('[NestBasket] No GitHub token set. Click extension icon to set token.');
    return 0;
  }

  // Get current file
  const { content, sha } = await getCurrentPrices();

  // Merge new prices into existing
  if (!content[store]) content[store] = {};
  for (const p of products) {
    const key = normalizeKey(p.name);
    content[store][key] = {
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
  content.lastUpdated = new Date().toISOString();
  content.totalProducts = Object.values(content)
    .filter(v => typeof v === 'object' && !Array.isArray(v))
    .reduce((sum, storeObj) => sum + Object.keys(storeObj).length, 0);

  // Commit updated file to GitHub
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore: update ${store} prices (${products.length} products)`,
      content: btoa(JSON.stringify(content, null, 2)),
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub write failed: ${res.status} — ${errText}`);
  }

  console.log(`[NestBasket] ✅ Saved ${products.length} ${store} prices to GitHub`);
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
