// popup.js — Updates the popup with live sync status
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (data) => {
  if (!data) return;

  document.getElementById('syncCount').textContent = data.syncCount || 0;

  const stores = new Set();
  if (data.lastStore) stores.add(data.lastStore);
  document.getElementById('storeCount').textContent = stores.size;

  if (data.lastSync) {
    const d = new Date(data.lastSync);
    document.getElementById('lastSyncText').textContent =
      `Last synced: ${d.toLocaleTimeString('en-IN')}`;

    if (data.lastStore) {
      const el = document.getElementById(`${data.lastStore}-status`);
      if (el) {
        el.textContent = 'Live ✅';
        el.className = 'badge live';
      }
    }
  }
});
