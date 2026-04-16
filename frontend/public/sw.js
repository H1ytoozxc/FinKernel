/* Basic PWA service worker: cache app shell */
const CACHE_NAME = "finkernel-shell-v1";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pwa-icon.svg",
  "/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve(true))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache same-origin static assets opportunistically
          try {
            const url = new URL(req.url);
            if (url.origin === self.location.origin && (url.pathname.startsWith("/assets/") || url.pathname.endsWith(".svg"))) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
            }
          } catch {}
          return res;
        })
        .catch(() => cached || fetch(req));
    })
  );
});

