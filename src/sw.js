const cacheName = "v1";

this.addEventListener("install", function (event) {
    console.log(event);

    event.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                return cache.addAll(["/index.html", "/app.js", "/assets"]);
            })
            .catch(console.log("failed to open cache"))
    );
});

this.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
            .open(cacheName).then(cache => {
                return fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());

                    return networkResponse;
                }).catch(()=>{
                    return cache.match(event.request);
                })
            }));

            // TODO: implement stale-while-revalidate strategy for svgs

            // .open(cacheName).then(cache => {
            //     return cache.match(event.request).then(cachedResponse => {
            //         const fetchedResponse = fetch(event.request).then(networkResponse => {
            //             cache.put(event.request, networkResponse.clone());

            //             return networkResponse;
            //         });

            //         return cachedResponse || fetchedResponse;
            //     });
            // }));
});
