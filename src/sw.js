const cacheName = "v1";

this.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(["/", "/assets"]);
        })
    );
});

this.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.open(cacheName).then((cache) => {
            return fetch(event.request)
                .then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());

                    return networkResponse;
                })
                .catch(() => {
                    return cache.match(event.request);
                });
        })
    );
});
