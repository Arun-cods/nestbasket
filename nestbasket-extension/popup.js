// popup.js
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (data) => {
  if (!data) return;

  document.getElementById('syncCount').textContent = data.syncCount || 0;

  if (data.lastSync) {
    const d = new Date(data.lastSync);
    document.getElementById('lastSyncText').textContent =
      `Last synced: ${d.toLocaleTimeString('en-IN')}`;
  }

  if (data.lastStore) {
    const el = document.getElementById(`st-${data.lastStore}`);
    if (el) {
      el.textContent = 'Live ✅';
      el.className = 'badge live';
    }
    // Count active stores
    const activeCount = document.querySelectorAll('.badge.live').length;
    document.getElementById('storeCount').textContent = activeCount;
  }
});
