const CACHE_NAME = `big0trip-app-v.6`;

// Настроим кеширование статики во время установки SW.
self.addEventListener('install', (evt) => {
  console.log('sw, install', {evt});
  // Активация SW не произойдет, пока кеш не будет настроен.
  evt.waitUntil(
    // Открываем наш кеш.
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Добавляем в кеш список статических ресурсов.
        return cache.addAll([
          '/',
          '/index.html',
          '/bundle.js'
        ]);
      })
  );
});

self.addEventListener('activate', (evt) => {
  console.log('sw', 'activate', {evt});
});

// Пример аналогичен предыдущему шагу.
self.addEventListener('fetch', (evt) => {
  console.log('fetch', {evt, request: evt.request});
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        if (response) {
          return response;
        } else {
          return fetch(evt.request)
            .then(function(response) {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(evt.request, response.clone()));

              return response.clone();
            });
        }
      })
      .catch((err) => console.error({err}))
  );
});
