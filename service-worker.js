/**
 * JAFF STUDIO - Service Worker
 * Provides offline capability and caching for better performance
 */

const CACHE_VERSION = 'jaff-studio-v1.0.0';
const CACHE_NAME = `jaff-studio-${CACHE_VERSION}`;

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/about.html',
    '/services.html',
    '/portfolio.html',
    '/pricing.html',
    '/contact.html',
    '/css/styles.css',
    '/js/scripts.js',
    '/js/performance.js'
];

// File patterns to cache on request
const CACHE_PATTERNS = {
    images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
    styles: /\.css$/i,
    scripts: /\.js$/i,
    fonts: /\.(woff|woff2|ttf|otf)$/i
};

// Network-first resources (always try network first)
const NETWORK_FIRST_PATTERNS = [
    /\/api\//,
    /\/contact\.html$/,
    /formsubmit\.co/
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
    CACHE_PATTERNS.images,
    CACHE_PATTERNS.fonts,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /cdnjs\.cloudflare\.com/
];

// ============================================================
// INSTALL EVENT
// ============================================================
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching core files');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Installed successfully');
                // Force activation immediately
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Precaching failed:', error);
            })
    );
});

// ============================================================
// ACTIVATE EVENT
// ============================================================
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Delete old caches
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('jaff-studio-') && cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activated successfully');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// ============================================================
// FETCH EVENT
// ============================================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Determine caching strategy
    if (shouldUseNetworkFirst(url)) {
        event.respondWith(networkFirst(request));
    } else if (shouldUseCacheFirst(url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// ============================================================
// CACHING STRATEGIES
// ============================================================

/**
 * Network First - Try network, fall back to cache
 * Best for: Dynamic content, API calls
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            console.log('[Service Worker] Serving from cache (offline):', request.url);
            return cachedResponse;
        }

        // Return offline page if available
        return caches.match('/offline.html') || new Response('Offline - content not cached', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Cache First - Try cache, fall back to network
 * Best for: Static assets, images, fonts
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Fetch failed:', request.url, error);
        return new Response('Resource not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
}

/**
 * Stale While Revalidate - Serve from cache, update in background
 * Best for: Most content - fast response with eventual consistency
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // Fetch from network in background
    const fetchPromise = fetch(request).then((networkResponse) => {
        // Update cache with fresh content
        if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, but we already returned cache
        return null;
    });

    // Return cached response immediately, or wait for network
    return cachedResponse || fetchPromise;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function shouldUseNetworkFirst(url) {
    return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname + url.search));
}

function shouldUseCacheFirst(url) {
    return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

// ============================================================
// MESSAGE EVENT (for cache management)
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                return { success: true, message: 'Cache cleared' };
            })
        );
    }

    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        event.waitUntil(
            caches.open(CACHE_NAME).then(async (cache) => {
                const keys = await cache.keys();
                return {
                    success: true,
                    size: keys.length,
                    version: CACHE_VERSION
                };
            })
        );
    }
});

// ============================================================
// SYNC EVENT (for background sync)
// ============================================================
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-form-submission') {
        event.waitUntil(syncFormSubmissions());
    }
});

async function syncFormSubmissions() {
    // Handle queued form submissions when back online
    // This would integrate with your contact form system
    console.log('[Service Worker] Syncing form submissions');
}

console.log('[Service Worker] Loaded');
