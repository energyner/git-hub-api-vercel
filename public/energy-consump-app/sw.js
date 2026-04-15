//sw.js
//convertir APIs de git-api-energyner-vercel en APP junto con manifest.json
const CACHE_NAME = 'git-hub-api-vercel';
const urlsToCache = [
  'index.html',
  'assets/css/main1.css', 
  'assets/js/energy-consump.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});