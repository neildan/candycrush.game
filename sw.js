// Set a name for the current cache
var cacheName = 'v1_candy_crush_neildan_cache';

// Default files to always cache
var cacheFiles = [
  './',
  './js/app.js',
  './js/game.js',
  './js/jquery-3.5.1.min.js',
  './js/jquery-countdown-timer-control.js',
  './css/estilos.css',
  './fonts/PressStart2P.ttf',
  './image/board_elements/candies/1.png',
  './image/board_elements/candies/2.png',
  './image/board_elements/candies/3.png',
  './image/board_elements/candies/4.png',
  './image/icons/trofeo_1.png',
  './image/icons/trofeo_2.png',
  './image/icons/trofeo_3.png',
  './image/icons/candy-store-16.png',
  './image/icons/candy-store-24.png',
  './image/icons/candy-store-32.png',
  './image/icons/candy-store-64.png',
  './image/icons/candy-store-128.png',
  './image/icons/candy-store-256.png',
  './image/icons/candy-store-512.png',
]

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Installed');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activated');
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (thisCacheName) {
        if (thisCacheName !== cacheName) {
          console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request)
      .then(function (response) {
        if (response) {
          console.log("[ServiceWorker] Found in Cache", e.request.url, response);
          return response;
        }

        var requestClone = e.request.clone();
        return fetch(requestClone)
          .then(function (response) {

            if (!response) {
              console.log("[ServiceWorker] No response from fetch ")
              return response;
            }

            var responseClone = response.clone();

            caches.open(cacheName).then(function (cache) {
              cache.put(e.request, responseClone);
              console.log('[ServiceWorker] New Data Cached', e.request.url);
              return response;
            });

          })
          .catch(function (err) {
            console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
          });
      })
  );
});