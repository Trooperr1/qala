/**
 * JAFF STUDIO - Script Loading Optimization
 * Loads heavy scripts asynchronously to prevent blocking
 */

(function() {
    'use strict';

    // Defer Google Translate initialization
    window.googleTranslateElementInit = function() {
        if (typeof google !== 'undefined' && google.translate) {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,de,fr,it',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        }
    };

    // Note: 3D background initialization is now handled in scripts.js
    // This was moved to prevent duplicate initialization

    // Preconnect to external domains for faster loading
    function addPreconnect(url) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    // Add preconnects early
    addPreconnect('https://fonts.googleapis.com');
    addPreconnect('https://fonts.gstatic.com');
    addPreconnect('https://cdnjs.cloudflare.com');

})();
