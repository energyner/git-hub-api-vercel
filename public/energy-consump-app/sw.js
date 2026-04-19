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
// 🔥 SERVICE WORKER PRO - ENERGY CONSUMPTION APP
// Compatible: Vercel + iOS + Android
// ============================================================

const VERSION = 'v3';
const CACHE_NAME = `energy-app-${VERSION}`;

// 🔥 SOLO rutas DIRECTAS (sin redirects)
const CORE_ASSETS = [
  '/energy-consump-app/index.html',
  '/energy-consump-app/energy-consump.js',
  '/assets/css/main1.css',
  '/assets/img/logo192x192.png'
];

// ============================================================
// 🟢 INSTALL (cache inicial seguro)
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

  self.skipWaiting(); // 🔥 activa inmediatamente
});

// ============================================================
// 🔵 ACTIVATE (limpieza de versiones antiguas)
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

  self.clients.claim(); // 🔥 toma control inmediato
});

// ============================================================
// 🟡 FETCH (estrategia inteligente)
// ============================================================

self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ========================================================
  // 🧠 1. HTML → NETWORK FIRST (CRÍTICO PARA iOS)
  // ========================================================

  if (event.request.headers.get('accept')?.includes('text/html')) {

    event.respondWith(

      fetch(event.request, { redirect: 'manual' }) // 🔥 evita redirects

        .then(response => {

          // 🚫 bloquear redirects (Safari)
          if (response.type === 'opaqueredirect') {
            console.warn('🚫 Redirect bloqueado:', event.request.url);
            return caches.match('/energy-consump-app/index.html');
          }

          // ✔ guardar copia fresca
          const clone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });

          return response;
        })

        .catch(() => {
          console.log('⚠️ Offline → usando cache HTML');
          return caches.match('/energy-consump-app/index.html');
        })

    );

    return;
  }

  // ========================================================
  // ⚡ 2. JS / CSS / IMG → CACHE FIRST
  // ========================================================

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) {
        return cached;
      }

      return fetch(event.request, { redirect: 'manual' })

        .then(response => {

          // 🚫 bloquear redirects
          if (response.type === 'opaqueredirect') {
            console.warn('🚫 Redirect asset bloqueado:', event.request.url);
            return response;
          }

          // ✔ guardar en cache
          const clone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });

          return response;
        })

        .catch(() => {
          console.warn('❌ Recurso no disponible:', event.request.url);
        });

    })

  );

});

// ============================================================
// 🔴 FALLBACK OFFLINE (OPCIONAL)
// ============================================================

// Puedes agregar una página offline si quieres:
// '/energy-consump-app/offline.html'

// ============================================================
// 🧪 DEBUG
// ============================================================

self.addEventListener('message', event => {
  console.log('📩 SW Message:', event.data);
});