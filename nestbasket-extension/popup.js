// popup.js
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (data) => {
  if (!data) return;

  if (data.hasToken) {
    // Token is set — show stats and stores
    document.getElementById('tokenSection').style.display = 'none';
    document.getElementById('statsSection').style.display = 'grid';
    document.getElementById('storesSection').style.display = 'block';
    document.getElementById('tipSection').style.display = 'block';

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
      document.getElementById('storeCount').textContent = activeCount || 1;
    }
  } else {
    // No token — show setup form
    document.getElementById('tokenSection').style.display = 'block';
    document.getElementById('statsSection').style.display = 'none';
    document.getElementById('storesSection').style.display = 'none';
    document.getElementById('tipSection').style.display = 'none';
  }
});

// Save token button
document.getElementById('saveToken').addEventListener('click', () => {
  const token = document.getElementById('tokenInput').value.trim();
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    alert('Please paste a valid GitHub token starting with ghp_ or github_pat_');
    return;
  }
  chrome.runtime.sendMessage({ type: 'SET_TOKEN', token }, (res) => {
    if (res && res.success) {
      document.getElementById('tokenSection').style.display = 'none';
      document.getElementById('statsSection').style.display = 'grid';
      document.getElementById('storesSection').style.display = 'block';
      document.getElementById('tipSection').style.display = 'block';
      document.getElementById('headerSub').textContent = '✅ Token saved! Now open any grocery store.';
    }
  });
});
