//sw.js
// //convertir APIs de git-api-energyner-vercel en APP junto con manifest.json
// const CACHE_NAME = 'git-hub-api-vercel';
// const urlsToCache = [
//   '/energy-consump-app/index.html',
//   '/energy-consump-app/energy-consump.js',
//   '/assets/css/main1.css'
// ];

// self.addEventListener('fetch', event => {

//   if (event.request.method !== 'GET') return;

//   event.respondWith(

//     fetch(event.request, { redirect: 'manual' }) // 🔥 clave iOS

//       .then(response => {

//         if (response.type === 'opaqueredirect') {
//           console.warn('🚫 Redirect bloqueado:', event.request.url);
//           return caches.match('/energy-consump-app/index.html');
//         }

//         return response;

//       })

//       .catch(() => caches.match(event.request))

//   );

// });

// self.addEventListener('activate', event => {

//   event.waitUntil(
//     caches.keys().then(keys =>
//       Promise.all(
//         keys.map(key => {
//           if (key !== CACHE_NAME) {
//             return caches.delete(key);
//           }
//         })
//       )
//     )
//   );

// });
// ============================================================
// 🔥 SERVICE WORKER PRO FINAL - ENERGY APP
// Vercel + iOS + Android READY
// ============================================================

const VERSION = 'v4';
const CACHE_NAME = `energy-app-${VERSION}`;

const CORE_ASSETS = [
  '/energy-consump-app/index.html',
  '/energy-consump-app/energy-consump.js',
  '/assets/css/main1.css',
  '/assets/img/logo192x192.png'
];

// ============================================================
// 🟢 INSTALL
// ============================================================

self.addEventListener('install', event => {

  console.log('🟢 SW Install:', VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {

      for (const url of CORE_ASSETS) {
        try {
          await cache.add(url);
          console.log('✅ Cacheado:', url);
        } catch (err) {
          console.warn('❌ Fallo cache:', url);
        }
      }

    })
  );

  self.skipWaiting();
});

// ============================================================
// 🔵 ACTIVATE
// ============================================================

self.addEventListener('activate', event => {

  console.log('🔵 SW Activate:', VERSION);

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Eliminando cache viejo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ============================================================
// 🟡 FETCH
// ============================================================

self.addEventListener('fetch', event => {


  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('/api/')) {
        return; // No interceptar, dejar que el navegador maneje la petición de red pura
    }
  // 🔥 NO interceptar externos (CDN, Google, jsdelivr, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const accept = event.request.headers.get('accept') || '';

  // ========================================================
  // 🧠 HTML → NETWORK FIRST (iOS FIX)
  // ========================================================

  if (accept.includes('text/html')) {

    event.respondWith(

      fetch(event.request, { redirect: 'manual' })

        .then(response => {

          // 🚫 bloquear redirects (Safari)
          if (response.type === 'opaqueredirect') {
            console.warn('🚫 Redirect bloqueado:', event.request.url);
            return caches.match('/energy-consump-app/index.html');
          }

          // ✔ guardar en cache
          const clone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });

          return response;
        })

        .catch(() => {

          console.log('⚠️ Offline HTML fallback');

          return caches.match('/energy-consump-app/index.html') ||
            new Response('<h1>Offline</h1>', {
              headers: { 'Content-Type': 'text/html' }
            });

        })

    );

    return;
  }

  // ========================================================
  // ⚡ ASSETS → CACHE FIRST
  // ========================================================

  event.respondWith(

    caches.match(event.request)

      .then(cached => {

        if (cached) return cached;

        return fetch(event.request)

          .then(response => {

            // ✔ seguridad: asegurar Response válido
            if (!response || response.status !== 200) {
              return response;
            }

            const clone = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });

            return response;
          })

          .catch(() => {

            console.warn('❌ Recurso no disponible:', event.request.url);

            // 🔥 SIEMPRE devolver Response (fix error crítico)
            return new Response('', {
              status: 404,
              statusText: 'Not Found'
            });

          });

      })

  );

});

// ============================================================
// 🧪 DEBUG
// ============================================================

self.addEventListener('message', event => {
  console.log('📩 SW Message:', event.data);
});