// Bump this version whenever app files change so users get the update
const CACHE = "fitquest-v20";
const ASSETS = [
  "./",
  "index.html",
  "app.css",
  "app.js",
  "music.js",
  "art.js",
  "battle.js",
  "manifest.json",
  "fonts/press-start-2p.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: "reload" })))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Cache-first: the app works fully offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: event.request.mode === "navigate" }).then(
      (cached) =>
        cached ||
        fetch(event.request).catch((err) => {
          // Offline and the address isn't cached exactly (e.g. no trailing slash): serve the app
          if (event.request.mode === "navigate") return caches.match("./");
          throw err;
        })
    )
  );
});
