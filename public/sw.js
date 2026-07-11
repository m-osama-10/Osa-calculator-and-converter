// ============================================================================
// Zoma Calculator and OSA Converter — Service Worker
// ============================================================================
// Provides offline-first caching for the PWA. Uses a stale-while-revalidate
// strategy for navigations and a cache-first strategy for static assets.
// ============================================================================

const CACHE_VERSION = "zoma-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/robots.txt",
];

// Install: pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {
        // If any single add fails, ignore — we'll cache on demand
      })
    )
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("zoma-") && key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for navigations, cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip Next.js dev/HMR requests
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Navigation requests — stale-while-revalidate
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetchPromise = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetchPromise;
      })
    );
    return;
  }

  // Static assets (_next/static, images, etc.) — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(?:js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$/)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Default: try network, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Listen for messages from the client (e.g., to skip waiting on update)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
