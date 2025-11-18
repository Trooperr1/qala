// ============================================
// LIVE CHAT WIDGET - TAWK.TO INTEGRATION
// ============================================

/*
 * SETUP INSTRUCTIONS:
 * 1. Sign up for free at https://www.tawk.to/
 * 2. Create a new property for your website
 * 3. Get your unique property ID from the dashboard
 * 4. Replace 'YOUR_PROPERTY_ID' and 'YOUR_WIDGET_ID' below with your actual IDs
 *
 * The widget will appear in the bottom-right corner automatically
 * You can customize colors, position, and behavior in Tawk.to dashboard
 */

// Tawk.to Live Chat Integration
(function() {
    // ⚠️ REPLACE THESE WITH YOUR ACTUAL TAWK.TO IDS
    const TAWK_PROPERTY_ID = 'YOUR_PROPERTY_ID'; // Example: '5f1234567890abcdef123456'
    const TAWK_WIDGET_ID = 'YOUR_WIDGET_ID'; // Example: 'default'

    // Only load if IDs are configured
    if (TAWK_PROPERTY_ID === 'YOUR_PROPERTY_ID') {
        console.log('⚠️ Live Chat: Please configure your Tawk.to property ID in js/livechat.js');
        return;
    }

    // Load Tawk.to script
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();

    (function(){
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
    })();

    // Optional: Customize widget behavior
    Tawk_API.onLoad = function(){
        console.log('✓ Live Chat loaded successfully');

        // You can add custom behavior here
        // Example: Hide widget on mobile
        // if (window.innerWidth < 768) {
        //     Tawk_API.hideWidget();
        // }
    };

    // Optional: Track visitor info
    Tawk_API.onChatStarted = function(){
        // Track in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_started', {
                'event_category': 'engagement',
                'event_label': 'Live Chat'
            });
        }
    };
})();

// Alternative: Custom chat button trigger
function openLiveChat() {
    if (typeof Tawk_API !== 'undefined' && Tawk_API.maximize) {
        Tawk_API.maximize();
    }
}

// Make function globally available
window.openLiveChat = openLiveChat;
