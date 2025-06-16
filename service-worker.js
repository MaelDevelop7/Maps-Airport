const CACHE_NAME = 'maps-airport-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app-icon.png',
  '/app.js',
  '/style.css',
  '/mad.png',
  '/cdg.png',
  '/MAD.json',
  '/CDG.json',
  '/SystemListener.js',
  // ajoute ici d'autres fichiers essentiels comme JS, CSS, fonts...
];

// Installation du service worker et mise en cache des fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker et nettoyage des caches obsolètes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(name => {
            if (name !== CACHE_NAME) return caches.delete(name);
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Interception des requêtes pour servir les ressources en cache ou fetch réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
