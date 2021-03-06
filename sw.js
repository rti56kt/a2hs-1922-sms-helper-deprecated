const cacheName = 'cache-v1';
const cacheResources = [
    '/a2hs-1922-sms-helper/',
    '/a2hs-1922-sms-helper/index.html',
    '/a2hs-1922-sms-helper/manifest.webmanifest',
    '/a2hs-1922-sms-helper/js/main.js',
    '/a2hs-1922-sms-helper/js/app/instascan.min.js',
    '/a2hs-1922-sms-helper/images/logo.svg',
    '/a2hs-1922-sms-helper/images/icons/logo-192.png',
    '/a2hs-1922-sms-helper/images/icons/logo-192-for-apple.png',
    '/a2hs-1922-sms-helper/images/icons/logo-192-maskable.png',
    '/a2hs-1922-sms-helper/images/icons/logo-512.png',
    'https://raw.githubusercontent.com/schmich/instascan/master/assets/qr.png',
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
