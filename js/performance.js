/**
 * JAFF STUDIO - Performance Optimization Suite
 *
 * Features:
 * - Lazy loading for images and iframes
 * - WebP format detection and conversion
 * - Performance monitoring and reporting
 * - Resource hints (preconnect, prefetch)
 * - Critical CSS detection
 */

// ============================================================
// CONFIGURATION
// ============================================================
const PERF_CONFIG = {
    lazyLoading: {
        enabled: true,
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01
    },
    webp: {
        enabled: true,
        fallbackFormat: 'jpg'
    },
    monitoring: {
        enabled: true,
        reportToConsole: true,
        reportToAnalytics: false // Set to true when analytics is configured
    },
    serviceWorker: {
        enabled: true,
        scope: '/'
    }
};

// ============================================================
// LAZY LOADING SYSTEM
// ============================================================
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if (!PERF_CONFIG.lazyLoading.enabled) return;

        // Check for Intersection Observer support
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    rootMargin: PERF_CONFIG.lazyLoading.rootMargin,
                    threshold: PERF_CONFIG.lazyLoading.threshold
                }
            );

            this.observeElements();
        } else {
            // Fallback for older browsers - load all images immediately
            this.loadAllImages();
        }
    }

    observeElements() {
        // Observe images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        lazyImages.forEach(img => this.observer.observe(img));

        // Observe iframes with data-src attribute
        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        lazyIframes.forEach(iframe => this.observer.observe(iframe));

        // Observe background images
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        lazyBackgrounds.forEach(element => this.observer.observe(element));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadElement(element) {
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        } else if (element.tagName === 'IFRAME') {
            this.loadIframe(element);
        } else if (element.hasAttribute('data-bg')) {
            this.loadBackground(element);
        }
    }

    loadImage(img) {
        // Load srcset if available
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
        }

        // Load src
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }

        // Add loaded class for animations
        img.classList.add('lazy-loaded');

        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;
    }

    loadIframe(iframe) {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.classList.add('lazy-loaded');
            delete iframe.dataset.src;
        }
    }

    loadBackground(element) {
        if (element.dataset.bg) {
            element.style.backgroundImage = `url('${element.dataset.bg}')`;
            element.classList.add('lazy-loaded');
            delete element.dataset.bg;
        }
    }

    loadAllImages() {
        // Fallback: Load all lazy elements immediately
        const lazyElements = document.querySelectorAll('[data-src], [data-srcset], [data-bg]');
        lazyElements.forEach(element => this.loadElement(element));
    }
}

// ============================================================
// WEBP SUPPORT DETECTION
// ============================================================
class WebPSupport {
    constructor() {
        this.supported = null;
        this.check();
    }

    check() {
        if (!PERF_CONFIG.webp.enabled) {
            this.supported = false;
            return;
        }

        // Check if browser supports WebP
        const canvas = document.createElement('canvas');
        if (canvas.getContext && canvas.getContext('2d')) {
            // Check for WebP support
            this.supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } else {
            this.supported = false;
        }

        // Add class to html element
        if (this.supported) {
            document.documentElement.classList.add('webp-supported');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    }

    isSupported() {
        return this.supported;
    }

    convertImageUrl(url, fallbackFormat = 'jpg') {
        if (!this.supported) return url;

        // Replace image extension with .webp
        return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
}

// ============================================================
// PERFORMANCE MONITORING
// ============================================================
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        if (!PERF_CONFIG.monitoring.enabled) return;

        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
            this.collectMetrics();
        } else {
            window.addEventListener('load', () => {
                // Collect metrics after a short delay to ensure accuracy
                setTimeout(() => this.collectMetrics(), 0);
            });
        }
    }

    collectMetrics() {
        // Check if Performance API is available
        if (!window.performance || !window.performance.timing) {
            console.warn('Performance API not available');
            return;
        }

        const timing = window.performance.timing;
        const navigation = window.performance.navigation;

        // Calculate key metrics
        this.metrics = {
            // Page Load Time
            pageLoadTime: timing.loadEventEnd - timing.navigationStart,

            // DOM Content Loaded
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,

            // Time to First Byte (TTFB)
            timeToFirstByte: timing.responseStart - timing.navigationStart,

            // DNS Lookup Time
            dnsLookupTime: timing.domainLookupEnd - timing.domainLookupStart,

            // TCP Connection Time
            tcpConnectionTime: timing.connectEnd - timing.connectStart,

            // Server Response Time
            serverResponseTime: timing.responseEnd - timing.requestStart,

            // DOM Processing Time
            domProcessingTime: timing.domComplete - timing.domLoading,

            // Resource Load Time
            resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd,

            // Navigation Type
            navigationType: this.getNavigationType(navigation.type)
        };

        // Get additional metrics if available
        if (window.performance.getEntriesByType) {
            this.collectResourceMetrics();
            this.collectPaintMetrics();
        }

        // Report metrics
        this.reportMetrics();
    }

    collectResourceMetrics() {
        const resources = window.performance.getEntriesByType('resource');

        this.metrics.resourceCount = resources.length;
        this.metrics.resourceSize = 0;

        // Categorize resources
        const resourceTypes = {
            scripts: [],
            stylesheets: [],
            images: [],
            fonts: [],
            other: []
        };

        resources.forEach(resource => {
            // Categorize by initiator type
            if (resource.initiatorType === 'script' || resource.name.endsWith('.js')) {
                resourceTypes.scripts.push(resource);
            } else if (resource.initiatorType === 'link' || resource.name.endsWith('.css')) {
                resourceTypes.stylesheets.push(resource);
            } else if (resource.initiatorType === 'img' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resource.name)) {
                resourceTypes.images.push(resource);
            } else if (/\.(woff|woff2|ttf|otf)$/i.test(resource.name)) {
                resourceTypes.fonts.push(resource);
            } else {
                resourceTypes.other.push(resource);
            }

            // Sum up transfer sizes
            if (resource.transferSize) {
                this.metrics.resourceSize += resource.transferSize;
            }
        });

        this.metrics.resourceBreakdown = {
            scripts: resourceTypes.scripts.length,
            stylesheets: resourceTypes.stylesheets.length,
            images: resourceTypes.images.length,
            fonts: resourceTypes.fonts.length,
            other: resourceTypes.other.length
        };

        // Find slowest resources
        const slowestResources = resources
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5)
            .map(r => ({
                name: r.name.split('/').pop(),
                duration: Math.round(r.duration),
                size: r.transferSize ? Math.round(r.transferSize / 1024) + ' KB' : 'N/A'
            }));

        this.metrics.slowestResources = slowestResources;
    }

    collectPaintMetrics() {
        const paintMetrics = window.performance.getEntriesByType('paint');

        paintMetrics.forEach(metric => {
            if (metric.name === 'first-paint') {
                this.metrics.firstPaint = Math.round(metric.startTime);
            } else if (metric.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = Math.round(metric.startTime);
            }
        });

        // Get Largest Contentful Paint if available
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.largestContentfulPaint = Math.round(lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }
        }
    }

    getNavigationType(type) {
        const types = {
            0: 'navigate',
            1: 'reload',
            2: 'back_forward',
            255: 'reserved'
        };
        return types[type] || 'unknown';
    }

    reportMetrics() {
        if (PERF_CONFIG.monitoring.reportToConsole) {
            console.group('⚡ Performance Metrics');
            console.log('Page Load Time:', this.formatTime(this.metrics.pageLoadTime));
            console.log('DOM Content Loaded:', this.formatTime(this.metrics.domContentLoaded));
            console.log('Time to First Byte:', this.formatTime(this.metrics.timeToFirstByte));

            if (this.metrics.firstPaint) {
                console.log('First Paint:', this.formatTime(this.metrics.firstPaint));
            }

            if (this.metrics.firstContentfulPaint) {
                console.log('First Contentful Paint:', this.formatTime(this.metrics.firstContentfulPaint));
            }

            if (this.metrics.largestContentfulPaint) {
                console.log('Largest Contentful Paint:', this.formatTime(this.metrics.largestContentfulPaint));
            }

            console.log('Resource Count:', this.metrics.resourceCount);
            console.log('Total Transfer Size:', this.formatBytes(this.metrics.resourceSize));

            if (this.metrics.resourceBreakdown) {
                console.log('Resource Breakdown:', this.metrics.resourceBreakdown);
            }

            if (this.metrics.slowestResources) {
                console.log('Slowest Resources:', this.metrics.slowestResources);
            }

            // Performance grade
            console.log('Performance Grade:', this.getPerformanceGrade());
            console.groupEnd();
        }

        if (PERF_CONFIG.monitoring.reportToAnalytics && typeof gtag !== 'undefined') {
            // Send to Google Analytics
            gtag('event', 'performance_metrics', {
                page_load_time: this.metrics.pageLoadTime,
                time_to_first_byte: this.metrics.timeToFirstByte,
                first_contentful_paint: this.metrics.firstContentfulPaint
            });
        }
    }

    getPerformanceGrade() {
        const loadTime = this.metrics.pageLoadTime;

        if (loadTime < 1000) return '🟢 A (Excellent)';
        if (loadTime < 2000) return '🟡 B (Good)';
        if (loadTime < 3000) return '🟠 C (Fair)';
        return '🔴 D (Needs Improvement)';
    }

    formatTime(ms) {
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    }

    formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    getMetrics() {
        return this.metrics;
    }
}

// ============================================================
// RESOURCE HINTS
// ============================================================
class ResourceHints {
    constructor() {
        this.init();
    }

    init() {
        // Preconnect to external domains
        this.preconnect([
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com'
        ]);

        // DNS prefetch for third-party domains
        this.dnsPrefetch([
            'https://www.google-analytics.com',
            'https://translate.google.com'
        ]);
    }

    preconnect(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    dnsPrefetch(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    prefetchPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
}

// ============================================================
// SERVICE WORKER REGISTRATION
// ============================================================
class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    init() {
        if (!PERF_CONFIG.serviceWorker.enabled) return;

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                this.register();
            });
        }
    }

    async register() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: PERF_CONFIG.serviceWorker.scope
            });

            console.log('✅ Service Worker registered:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Service Worker update found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('✅ New Service Worker installed, refresh to activate');
                    }
                });
            });
        } catch (error) {
            console.warn('❌ Service Worker registration failed:', error);
        }
    }

    async unregister() {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
            console.log('Service Worker unregistered');
        }
    }
}

// ============================================================
// CRITICAL CSS LOADER
// ============================================================
class CriticalCSSLoader {
    constructor() {
        this.init();
    }

    init() {
        // Load non-critical CSS asynchronously
        const nonCriticalLinks = document.querySelectorAll('link[rel="stylesheet"][data-non-critical]');

        nonCriticalLinks.forEach(link => {
            // Change to preload
            link.rel = 'preload';
            link.as = 'style';

            // Change back to stylesheet on load
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
        });
    }
}

// ============================================================
// INITIALIZE ALL SYSTEMS
// ============================================================
class PerformanceOptimizer {
    constructor() {
        this.lazyLoader = null;
        this.webpSupport = null;
        this.performanceMonitor = null;
        this.resourceHints = null;
        this.serviceWorkerManager = null;
        this.criticalCSSLoader = null;

        this.init();
    }

    init() {
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeSystems());
        } else {
            this.initializeSystems();
        }
    }

    initializeSystems() {
        // Initialize all performance optimization systems
        this.webpSupport = new WebPSupport();
        this.lazyLoader = new LazyLoader();
        this.resourceHints = new ResourceHints();
        this.criticalCSSLoader = new CriticalCSSLoader();
        this.serviceWorkerManager = new ServiceWorkerManager();
        this.performanceMonitor = new PerformanceMonitor();

        console.log('⚡ Performance Optimization Suite initialized');
    }

    getMetrics() {
        return this.performanceMonitor ? this.performanceMonitor.getMetrics() : null;
    }
}

// Auto-initialize
const performanceOptimizer = new PerformanceOptimizer();

// Export for external access
window.performanceOptimizer = performanceOptimizer;
