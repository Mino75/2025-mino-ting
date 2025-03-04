const LIVE_CACHE = 'ting-v1';
const TEMP_CACHE = 'ting-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.js',
  '/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install: Download all assets into a temporary cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(TEMP_CACHE).then(tempCache => {
      // Fetch and cache every asset.
      return Promise.all(
        ASSETS.map(url => {
          return fetch(url).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return tempCache.put(url, response.clone());
          });
        })
      );
    })
  );
});

// Activate: If staging is complete, replace the live cache.
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const tempCache = await caches.open(TEMP_CACHE);
      const cachedRequests = await tempCache.keys();
      if (cachedRequests.length === ASSETS.length) {
        // New version is fully staged. Delete the old live cache.
        await caches.delete(LIVE_CACHE);
        const liveCache = await caches.open(LIVE_CACHE);
        // Copy everything from the temporary cache to the live cache.
        for (const request of cachedRequests) {
          const response = await tempCache.match(request);
          await liveCache.put(request, response);
        }
        // Delete the temporary cache.
        await caches.delete(TEMP_CACHE);
        // Optionally, notify clients to reload.
        const clients = await self.clients.matchAll();
        clients.forEach(client => client.postMessage({ action: 'reload' }));
      } else {
        // If staging failed, delete the temporary cache and keep the old live cache.
        console.error('Staging failed. Keeping the old cache.');
        await caches.delete(TEMP_CACHE);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // If the request is not HTTP/HTTPS, bypass caching entirely.
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(LIVE_CACHE).then(cache => {
            try {
              // Double-check that the protocol is supported before caching.
              if (requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') {
                cache.put(event.request, responseClone);
              }
            } catch (e) {
              console.error("Cache put error:", e);
            }
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Network error occurred', {
            status: 408,
            statusText: 'Network error'
          });
        });
      })
  );
});
