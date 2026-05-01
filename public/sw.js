const VERSION = '2024-12-07-v1';
const CACHE_NAME = `aldeyar-${VERSION}`;
const STATIC_CACHE = `aldeyar-static-${VERSION}`;
const DYNAMIC_CACHE = `aldeyar-dynamic-${VERSION}`;
const IMAGE_CACHE = `aldeyar-images-${VERSION}`;

const STATIC_ASSETS = [
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'];

// Listen for SKIP_WAITING message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('📨 Received SKIP_WAITING message - activating new version...');
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  console.log('⚙️ Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Caching static assets:', STATIC_ASSETS);
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Don't auto skip waiting - let the user decide via notification
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated - Version:', VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('aldeyar-') && 
                           ![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(name))
          .map((name) => {
            console.log('🗑️ Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin === location.origin && IMAGE_EXTENSIONS.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;

        return fetch(request).then((networkResponse) => {
          return caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  if (url.origin === location.origin) {
    const isHTMLRequest = request.headers.get('accept')?.includes('text/html') || 
                          request.mode === 'navigate' ||
                          url.pathname === '/';
    
    if (isHTMLRequest) {
      event.respondWith(
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return caches.match(request).then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
          })
      );
    } else {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request).then((networkResponse) => {
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }).catch(() => {
            return caches.match('/offline.html');
          });
        })
      );
    }
  }
});
