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
// 🔥 SERVICE WORKER PRO  (REFACTORED) - ENERGY APP
// Vercel + iOS + Android READY
// ============================================================

const VERSION = 'v5'; // Incrementamos versión para forzar actualización
const CACHE_NAME = `energy-app-${VERSION}`;

// Rutas ajustadas a la estructura de Vercel
const CORE_ASSETS = [
  './',                  // La carpeta actual (root de la app)
  './index.html',        // El archivo HTML
  './energy-consump.js', // La lógica que antes daba 404
  '../assets/css/main1.css', // Subir un nivel para ir a assets
  '../assets/img/logo192x192.png' // Subir un nivel para ir a assets
];

// ============================================================
// 🟢 INSTALL (Cache inicial)
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
          console.warn('❌ Fallo cache inicial (ignorado):', url);
        }
      }
    })
  );
  self.skipWaiting();
});

// ============================================================
// 🔵 ACTIVATE (Limpieza)
// ============================================================
self.addEventListener('activate', event => {
  console.log('🔵 SW Activate:', VERSION);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Eliminando cache antiguo:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ============================================================
// 🟡 FETCH (Estrategia de Resiliencia)
// ============================================================
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // 1. 🔥 EXCEPCIÓN PARA API (Cálculos y Traducción)
  // No interceptar para evitar errores de CORS o Redirección en Vercel
  if (event.request.url.includes('/api/')) {
    return;
  }

  // 2. 🔥 EXCEPCIÓN PARA EXTERNOS (Google Fonts, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const accept = event.request.headers.get('accept') || '';

  // 🧠 A. HTML -> NETWORK FIRST (SOLUCIÓN ICONO STANDALONE)
  if (accept.includes('text/html')) {
    event.respondWith(
      // 💡 ELIMINADO { redirect: 'manual' } para que Vercel resuelva el acceso
      fetch(event.request)
        .then(response => {
          // Si la respuesta es válida, actualizamos la caché
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('⚠️ Modo Offline: Sirviendo desde caché');
          return caches.match('/energy-consump-app/index.html') || caches.match('/energy-consump-app/');
        })
    );
    return;
  }

  // ⚡ B. ASSETS (JS, CSS, IMG) -> CACHE FIRST
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(() => {
        // Fallback silencioso para assets no encontrados
        return new Response('Asset not found', { status: 404 });
      });
    })
  );
});