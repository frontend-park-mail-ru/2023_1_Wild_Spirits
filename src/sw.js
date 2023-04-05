this.addEventListener("install", function(event) {
    console.log(event);

    event.waitUntil(
        caches.open("static-v1")
        .then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/app.js",
                "/assets",
        ])})
        .catch(
            console.log('failed to open cache')
        )
    )
});

this.addEventListener("activate", event=>{
    console.log(event)
})

this.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(()=>console.log("fetch failed"))
    );
});
