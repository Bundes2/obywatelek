const CACHE_NAME = 'mobywatel-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/dowodnowy.html',
  '/documents.html',
  '/services.html',
  '/qr.html',
  '/more.html',
  './dowodnowy_files/main.css',
  './dowodnowy_files/dowodnowy.css'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Some files could not be cached:', err);
        return cache.addAll(['/']);
      });
    })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return caches.match('/index.html');
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
