/* eslint-disable no-restricted-globals */

// This service worker satisfies the PWA installability requirements
const CACHE_NAME = "loma-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/logo192.png",
  "/logo512.png",
  "/favicon.ico",
  "/manifest.json"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force active immediately
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First with Cache Fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and skip browser extensions/other schemes
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Bypass caching for dynamic API requests - always fetch directly from network
  if (event.request.url.includes("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network response is valid, clone and cache it
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If both fail and request is for a document, we can return the cached root index.html safely
          const acceptHeader = event.request.headers.get("accept");
          if (acceptHeader && acceptHeader.includes("text/html")) {
            return caches.match("/index.html");
          }
          return null;
        });
      })
  );
});
