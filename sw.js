/* ==========================================================================
   LogicLab - Service Worker (PWABuilder-compliant)
   Strategy:
     - Pre-cache app shell on install
     - Navigation requests: Network-first, fall back to cache, then offline page
     - Static assets (CSS/JS/images): Cache-first, refresh in background
     - Clean up old caches on activate
   Version: 1.0.1
   ========================================================================== */

const CACHE_VERSION = 'logiclab-v1.0.1';
const OFFLINE_URL = './offline.html';

// App shell + core assets to pre-cache on install
const PRECACHE_URLS = [
  './',
  './index.html',
  './converter.html',
  './gates.html',
  './truth-tables.html',
  './arithmetic.html',
  './complements.html',
  './half-adder.html',
  './full-adder.html',
  './flipflops.html',
  './multiplexer.html',
  './demultiplexer.html',
  './encoder.html',
  './decoder.html',
  './formulas.html',
  './quiz.html',
  './notes.html',
  './about.html',
  './changelog.html',
  './offline.html',
  './manifest.json',
  './css/style.css',
  './css/responsive.css',
  './css/extra.css',
  './js/main.js',
  './js/components.js',
  './js/converter.js',
  './js/gates.js',
  './js/arithmetic.js',
  './js/quiz.js',
  './js/search.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './js/pwa.js'
];

/* --------------------- Install: Pre-cache app shell --------------------- */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Pre-cache failed:', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

/* --------------------- Activate: Clean up old caches --------------------- */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* --------------------- Helpers --------------------- */
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

/* --------------------- Fetch handler --------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin and non-http(s) requests (chrome-extension://, data:, etc.)
  if (url.origin !== self.location.origin) return;
  if (!url.protocol.startsWith('http')) return;

  // ---- Navigation requests: Network-first with offline fallback ----
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a fresh copy of the page
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          // Network failed: try cache, then offline page
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL) ||
            new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // ---- Static assets: Cache-first, refresh in background ----
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => null);

      // Return cached immediately if available, else wait for network
      return cached || networkFetch || new Response('Offline', { status: 503 });
    })
  );
});

/* --------------------- Message handler --------------------- */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => event.source?.postMessage({ type: 'CACHE_CLEARED' }))
    );
  }

  if (event.data.type === 'CHECK_UPDATE') {
    event.waitUntil(
      self.registration.update().then(() => event.source?.postMessage({ type: 'UPDATE_CHECKED' }))
    );
  }
});