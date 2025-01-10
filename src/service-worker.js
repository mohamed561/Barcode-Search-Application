// src/service-worker.js

const CACHE_NAME = 'my-app-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/static/media/logo.png',
  '/src/App.js',
    '/src/BarcodeSearch.js',
    '/src/index.js',
    '/src/serviceWorkerRegistration.js',
    '/src/components/BarcodeSearch.jsx',
    '/src/service-worker.js',
    '/public/manifest.json',
    '/public/favicon.ico',
    '/public/logo192.png',
    '/public/logo512.png',
    '/public/index.html',
    '/public/robots.txt',
    '/public/service-worker.js',
    '/public/static/js/main.js',
    '/public/static/css/main.css',
    '/public/static/media/logo.png',
    '/public/src/App.js',
    '/public/src/BarcodeSearch.js',
    '/public/src/index.js',
    '/public/src/serviceWorkerRegistration.js',
    '/public/src/components/BarcodeSearch.jsx',
    '/public/src/service-worker.js',
    '/public/public/manifest.json',
    '/public/public/favicon.ico',
    '/public/public/logo192.png',
    '/public/public/logo512.png',
    '/public/public/index.html',
    '/public/public/robots.txt',
    '/public/public/service-worker.js',
    '/public/public/static/js/main.js',
    'src/data/database.js',
    'src/index.css',
  // Add any other files here that should be cached for offline use
];

// Install event - caching the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serving cached content
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          return response;
        })
      );
    })
  );
});
