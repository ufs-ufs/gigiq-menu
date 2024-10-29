const CACHE_NAME = 'gigiq-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/menu.json',
    '/SurveyKuisioner.html',
    // Tambahkan semua sumber daya statis yang diperlukan
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    // Tambahkan skrip dan file lainnya jika diperlukan
];

// Instalasi Service Worker dan caching sumber daya
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Mengambil sumber daya dari cache jika tersedia
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response dari cache
                if (response) {
                    return response;
                }
                // Cache miss - fetch dari jaringan
                return fetch(event.request).then(
                    response => {
                        // Periksa apakah response valid
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response untuk caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Menghapus cache lama saat Service Worker diaktifkan
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
