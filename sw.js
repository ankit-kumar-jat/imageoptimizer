// servie worker
const cache_Name = "pwa-imageoptimizer-v1.0.04";

const staticAssets = [
    '/',
    '/index.html',
    '/features.html',
    '/contactus.html',
    '/privacy.html',
];

// handle service worker install
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches
            .open(cache_Name).then(function (cache) {
                return cache.addAll(staticAssets);
            })
            .then(() => {
                self.skipWaiting();
            })
    );
});;

// handle fetch requests
self.addEventListener('fetch', async event => {
    const req = event.request;

    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cache_Name);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cache_Name);
    try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        // const cachedResponse = await cache.match(req);
        return caches.match('/offline.html');
    }
}


// handle old cache remove
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return true;
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    if (cache_Name != cacheName && cacheName.startsWith("pwa-imageoptimizer")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// handle message for refresh
self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});