const cacheName = 'cache-v1';
const cacheResources = [
    '/a2hs-qrscanner/',
    '/a2hs-qrscanner/index.html',
    '/a2hs-qrscanner/js/main.js',
    '/a2hs-qrscanner/js/app/instascan.min.js',
    '/a2hs-qrscanner/images/logo.svg',
    '/a2hs-qrscanner/images/icons/logo-192.png',
    '/a2hs-qrscanner/images/icons/logo-512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js',
    'https://code.jquery.com/jquery-3.6.0.slim.min.js'
]

// install
self.addEventListener('install', event => {
    console.log('😏 Service worker is installed!');
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(cacheResources)));
});

// activate
self.addEventListener('activate', event => {
    console.log('🥳 Service worker is activated!');
    event.waitUntil(
        caches.keys().then(function(cacheNameArr) {
            var newCacheNameArr = cacheNameArr.map(function(item) {
                if (item !== cacheName) {
                    return caches.delete(item);
                }
            })
            return Promise.all(newCacheNameArr);
        })
    );
});

// fetch
self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});
