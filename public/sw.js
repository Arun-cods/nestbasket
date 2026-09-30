// NestBasket Service Worker - Cache-Buster & Network-First
const CACHE_NAME = 'nestbasket-v8-fresh';

self.addEventListener('install', (event) => {
  // Immediately take over from older service workers
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Delete ALL old caches
      return Promise.all(keys.map((k) => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Network-first strategy: always fetch fresh code from the server
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
