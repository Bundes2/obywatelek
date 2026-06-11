const CACHE_NAME = 'mobywatel-v1';
const BASE_PATH = '/obywatelek';

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/dashboard.html',
  BASE_PATH + '/dowodnowy.html',
  BASE_PATH + '/documents.html',
  BASE_PATH + '/services.html',
  BASE_PATH + '/qr.html',
  BASE_PATH + '/more.html',
  BASE_PATH + '/dowodnowy_files/main.css',
  BASE_PATH + '/dowodnowy_files/dowodnowy.css'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Some files could not be cached:', err);
        return cache.addAll([BASE_PATH + '/']);
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
        // Return cached HTML or offline page
        if (event.request.destination === 'document') {
          return caches.match(BASE_PATH + '/index.html');
        }
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
