const dataToCache = "v1"

self.addEventListener("install", (event) => {
    self.skipWaiting()
 })
 
 self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(resp => {
            return resp || fetch(event.request).then(async response =>  {
                const cache = await caches.open(dataToCache);
                cache.put(event.request, response.clone())
                return response;
            })
        })
        )
 
 })
 
 
 self.addEventListener('activate', () => {
    self.skipWaiting();
    console.log('Service worker activated', new Date().toLocaleTimeString());
});