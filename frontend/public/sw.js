// Basic offline-first service worker generated manually.
// For a production app we would generate this via workbox.

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Network-first; we can plug in smarter caching later.
});

