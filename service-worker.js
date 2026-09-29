const CACHE_NAME = "barrio-digital-v1";

const ARCHIVOS_PRINCIPALES = [
  "./",
  "./index.html",
  "./app.js",
  "./css/styles.css",
  "./data/negocios.json",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ARCHIVOS_PRINCIPALES))
      .then(() => self.skipWaiting())
  );

});


self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys => {

      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );

    }).then(() => self.clients.claim())
  );

});


self.addEventListener("fetch", event => {

  const request = event.request;

  if(request.method !== "GET") return;

  const url = new URL(request.url);

  /*
    Solo manejamos con caché los archivos
    que pertenecen a Barrio Digital.
  */

  if(url.origin === location.origin){

    event.respondWith(

      fetch(request)
        .then(response => {

          const copia = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, copia));

          return response;

        })
        .catch(() => caches.match(request))

    );

  }

});
