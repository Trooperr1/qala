/**
 * JAFF STUDIO - Conversion Optimization Suite
 *
 * Features:
 * - Exit-intent popup
 * - Scroll-triggered sticky CTA
 * - Social proof notifications
 * - Lead magnet modals
 * - Conversion event tracking
 */

// Configuration
const CONVERSION_CONFIG = {
    exitIntent: {
        enabled: false, // Disabled per user request
        showDelay: 5000, // Don't show for first 5 seconds on page
        cookieName: 'jaff_exit_shown',
        cookieDays: 7 // Don't show again for 7 days
    },
    stickyCTA: {
        enabled: false, // Disabled per user request
        showAfterScroll: 500 // Show after scrolling 500px
    },
    socialProof: {
        enabled: true,
        showDelay: 3000, // First notification after 3 seconds
        interval: 15000, // New notification every 15 seconds
        displayDuration: 5000 // Show each notification for 5 seconds
    },
    tracking: {
        enabled: true,
        gaEnabled: false // Set to true when Google Analytics is configured
    }
};

// Utility: Cookie Management
const CookieManager = {
    set: function(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },
    get: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    delete: function(name) {
        this.set(name, "", -1);
    }
};

// Utility: Conversion Event Tracking
const ConversionTracker = {
    track: function(eventName, eventData = {}) {
        if (!CONVERSION_CONFIG.tracking.enabled) return;

        // Log to console for debugging
        console.log('Conversion Event:', eventName, eventData);

        // Send to Google Analytics if enabled
        if (CONVERSION_CONFIG.tracking.gaEnabled && typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        // You can add other analytics platforms here (Facebook Pixel, etc.)
    }
};

// ============================================================
// EXIT-INTENT POPUP
// ============================================================
class ExitIntentPopup {
    constructor() {
        this.shown = false;
        this.timeOnPage = 0;
        this.init();
    }

    init() {
        if (!CONVERSION_CONFIG.exitIntent.enabled) return;

        // Check if already shown recently
        if (CookieManager.get(CONVERSION_CONFIG.exitIntent.cookieName)) {
            return;
        }

        // Track time on page
        setTimeout(() => {
            this.timeOnPage = CONVERSION_CONFIG.exitIntent.showDelay;
            this.attachListeners();
        }, CONVERSION_CONFIG.exitIntent.showDelay);
    }

    attachListeners() {
        document.addEventListener('mouseout', (e) => {
            if (e.clientY <= 0 && !this.shown) {
                this.show();
            }
        });

        // Mobile: Show on scroll up
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop < lastScrollTop && scrollTop > 300 && !this.shown) {
                // Scrolling up after being down the page
                this.show();
            }
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    show() {
        this.shown = true;

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'exit-intent-modal';
        modal.innerHTML = `
            <div class="exit-intent-overlay"></div>
            <div class="exit-intent-content">
                <button class="exit-intent-close" onclick="exitIntentPopup.close()">&times;</button>

                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">⏱️</div>
                    <h2 style="font-size: 2rem; font-weight: 900; margin-bottom: 15px; color: #000;">Wait! Before You Go...</h2>
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 30px; line-height: 1.7;">
                        Get our <strong>FREE Website Launch Checklist</strong> – the same one we use for $50,000+ projects.
                    </p>

                    <form id="exit-intent-form" style="max-width: 400px; margin: 0 auto;">
                        <input type="email"
                               placeholder="Enter your email"
                               required
                               style="width: 100%; padding: 15px 20px; border: 2px solid #e0e0e0; border-radius: 50px; font-size: 1rem; margin-bottom: 15px;">

                        <button type="submit"
                                class="cta-button"
                                style="width: 100%; background: #000; color: #fff; padding: 15px 30px; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; transition: transform 0.3s ease;">
                            Send Me the Checklist →
                        </button>

                        <p style="font-size: 0.85rem; color: #999; margin-top: 15px;">
                            No spam, unsubscribe anytime. Read our <a href="legal-pages/privacy-policy.html" style="color: #000; text-decoration: underline;">Privacy Policy</a>.
                        </p>
                    </form>

                    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e0e0e0;">
                        <p style="color: #666; font-size: 0.95rem;">🎁 <strong>Bonus:</strong> Weekly tips on AI, web development, and growth strategies</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Handle form submission
        document.getElementById('exit-intent-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e.target);
        });

        // Track event
        ConversionTracker.track('exit_intent_shown', {
            page: window.location.pathname
        });

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    handleSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;

        // Track conversion
        ConversionTracker.track('exit_intent_submitted', {
            email_captured: true,
            page: window.location.pathname
        });

        // Here you would send to your email service (Mailchimp, ConvertKit, etc.)
        console.log('Exit intent email captured:', email);

        // Show thank you message
        document.querySelector('.exit-intent-content').innerHTML = `
            <div style="text-align: center; padding: 60px 40px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">✅</div>
                <h2 style="font-size: 2rem; font-weight: 900; margin-bottom: 15px; color: #000;">Check Your Email!</h2>
                <p style="font-size: 1.1rem; color: #666; margin-bottom: 30px; line-height: 1.7;">
                    We've sent the checklist to <strong>${email}</strong>
                </p>
                <button onclick="exitIntentPopup.close()" class="cta-button" style="background: #000; color: #fff; padding: 15px 40px; border: none; border-radius: 50px; font-weight: 700; cursor: pointer;">
                    Continue Browsing
                </button>
            </div>
        `;

        // Set cookie so it doesn't show again
        CookieManager.set(CONVERSION_CONFIG.exitIntent.cookieName, 'true', CONVERSION_CONFIG.exitIntent.cookieDays);

        // Auto-close after 3 seconds
        setTimeout(() => this.close(), 3000);
    }

    close() {
        const modal = document.getElementById('exit-intent-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        // Set cookie even if closed without submitting
        if (!CookieManager.get(CONVERSION_CONFIG.exitIntent.cookieName)) {
            CookieManager.set(CONVERSION_CONFIG.exitIntent.cookieName, 'closed', 1); // Show again tomorrow
        }
    }
}

// ============================================================
// STICKY SCROLL CTA
// ============================================================
class StickyScrollCTA {
    constructor() {
        this.visible = false;
        this.init();
    }

    init() {
        if (!CONVERSION_CONFIG.stickyCTA.enabled) return;

        // Create sticky CTA bar
        const cta = document.createElement('div');
        cta.id = 'sticky-scroll-cta';
        cta.innerHTML = `
            <div class="sticky-cta-content">
                <div class="sticky-cta-text">
                    <strong>Ready to transform your business?</strong>
                    <span>Get a free consultation with our experts</span>
                </div>
                <a href="contact.html" class="sticky-cta-button">
                    Book Free Consultation →
                </a>
                <button class="sticky-cta-close" onclick="stickyScrollCTA.hide()">&times;</button>
            </div>
        `;

        document.body.appendChild(cta);

        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;

            if (scrolled > CONVERSION_CONFIG.stickyCTA.showAfterScroll && !this.visible) {
                this.show();
            }
        }, { passive: true });
    }

    show() {
        const cta = document.getElementById('sticky-scroll-cta');
        if (cta && !this.visible) {
            cta.classList.add('visible');
            this.visible = true;

            ConversionTracker.track('sticky_cta_shown', {
                scroll_depth: window.pageYOffset
            });
        }
    }

    hide() {
        const cta = document.getElementById('sticky-scroll-cta');
        if (cta) {
            cta.classList.remove('visible');
            this.visible = false;
        }
    }
}

// ============================================================
// SOCIAL PROOF NOTIFICATIONS
// ============================================================
class SocialProofNotifications {
    constructor() {
        this.notifications = [
            { name: 'Michael R.', action: 'just booked a consultation', location: 'Zurich', time: '2 minutes ago' },
            { name: 'Sarah K.', action: 'downloaded the AI Chatbot Guide', location: 'Geneva', time: '5 minutes ago' },
            { name: 'David L.', action: 'requested a website quote', location: 'Bern', time: '8 minutes ago' },
            { name: 'Emma W.', action: 'subscribed to the newsletter', location: 'Basel', time: '12 minutes ago' },
            { name: 'Thomas M.', action: 'just booked a consultation', location: 'Lausanne', time: '15 minutes ago' },
            { name: 'Lisa P.', action: 'downloaded the Launch Checklist', location: 'Lugano', time: '18 minutes ago' }
        ];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        if (!CONVERSION_CONFIG.socialProof.enabled) return;

        // Create notification container
        const container = document.createElement('div');
        container.id = 'social-proof-container';
        document.body.appendChild(container);

        // Start showing notifications
        setTimeout(() => {
            this.showNext();
            setInterval(() => this.showNext(), CONVERSION_CONFIG.socialProof.interval);
        }, CONVERSION_CONFIG.socialProof.showDelay);
    }

    showNext() {
        const notification = this.notifications[this.currentIndex];
        this.show(notification);

        this.currentIndex = (this.currentIndex + 1) % this.notifications.length;
    }

    show(data) {
        const container = document.getElementById('social-proof-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.innerHTML = `
            <div class="social-proof-avatar">
                ${data.name.charAt(0)}
            </div>
            <div class="social-proof-content">
                <strong>${data.name}</strong>
                <p>${data.action}</p>
                <span class="social-proof-meta">
                    📍 ${data.location} • ${data.time}
                </span>
            </div>
        `;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('visible'), 10);

        // Track
        ConversionTracker.track('social_proof_shown', {
            notification_type: data.action
        });

        // Remove after duration
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => notification.remove(), 300);
        }, CONVERSION_CONFIG.socialProof.displayDuration);
    }
}

// ============================================================
// LEAD MAGNET TRIGGERS
// ============================================================
class LeadMagnetTriggers {
    constructor() {
        this.init();
    }

    init() {
        // Time-based trigger: Show after 30 seconds on pricing page
        if (window.location.pathname.includes('pricing.html')) {
            setTimeout(() => {
                this.showPricingMagnet();
            }, 30000);
        }

        // Scroll-based trigger: Show when reaching bottom of blog posts
        if (window.location.pathname.includes('/blog/')) {
            this.attachScrollTrigger();
        }
    }

    showPricingMagnet() {
        if (CookieManager.get('pricing_magnet_shown')) return;

        // Simple inline lead magnet
        const magnet = document.createElement('div');
        magnet.id = 'pricing-lead-magnet';
        magnet.className = 'inline-lead-magnet';
        magnet.innerHTML = `
            <div class="lead-magnet-content">
                <button class="lead-magnet-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <h3>💰 Get Custom Pricing</h3>
                <p>Not sure which package fits? Get a personalized quote based on your exact needs.</p>
                <a href="contact.html" class="cta-button">Get Custom Quote →</a>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(magnet, footer);

            ConversionTracker.track('lead_magnet_shown', {
                type: 'pricing_custom_quote',
                page: 'pricing'
            });

            CookieManager.set('pricing_magnet_shown', 'true', 1);
        }
    }

    attachScrollTrigger() {
        let triggered = false;

        window.addEventListener('scroll', () => {
            if (triggered) return;

            const scrolled = window.pageYOffset + window.innerHeight;
            const total = document.documentElement.scrollHeight;
            const percentage = (scrolled / total) * 100;

            if (percentage > 80) {
                this.showBlogMagnet();
                triggered = true;
            }
        }, { passive: true });
    }

    showBlogMagnet() {
        if (CookieManager.get('blog_magnet_shown')) return;

        const magnet = document.createElement('div');
        magnet.id = 'blog-lead-magnet';
        magnet.className = 'inline-lead-magnet';
        magnet.innerHTML = `
            <div class="lead-magnet-content" style="text-align: center;">
                <h3>📚 Want More Insights Like This?</h3>
                <p>Subscribe to get weekly expert tips on AI, web development, and digital growth.</p>
                <form onsubmit="event.preventDefault(); alert('Connected to your email service'); this.parentElement.parentElement.remove();" style="display: flex; gap: 10px; max-width: 500px; margin: 20px auto 0; flex-wrap: wrap; justify-content: center;">
                    <input type="email" placeholder="Enter your email" required style="flex: 1; min-width: 250px; padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 50px; font-size: 1rem;">
                    <button type="submit" class="cta-button">Subscribe</button>
                </form>
            </div>
        `;

        // Insert before related posts
        const article = document.querySelector('article');
        if (article) {
            article.appendChild(magnet);

            ConversionTracker.track('lead_magnet_shown', {
                type: 'blog_newsletter',
                page: window.location.pathname
            });

            CookieManager.set('blog_magnet_shown', 'true', 7);
        }
    }
}

// ============================================================
// INITIALIZE EVERYTHING
// ============================================================
let exitIntentPopup, stickyScrollCTA, socialProofNotifications, leadMagnetTriggers;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all conversion optimization features
    exitIntentPopup = new ExitIntentPopup();
    stickyScrollCTA = new StickyScrollCTA();
    socialProofNotifications = new SocialProofNotifications();
    leadMagnetTriggers = new LeadMagnetTriggers();

    // Track page view
    ConversionTracker.track('page_view', {
        page: window.location.pathname,
        referrer: document.referrer
    });
});

// Track outbound links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
        const isExternal = link.hostname !== window.location.hostname;
        const isCTA = link.classList.contains('cta-button') || link.classList.contains('cta-button-outline');

        if (isExternal) {
            ConversionTracker.track('outbound_link_click', {
                url: link.href,
                text: link.textContent.trim()
            });
        }

        if (isCTA) {
            ConversionTracker.track('cta_click', {
                text: link.textContent.trim(),
                url: link.href,
                page: window.location.pathname
            });
        }
    }
});

// Track form submissions
document.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM') {
        ConversionTracker.track('form_submitted', {
            form_id: e.target.id || 'unknown',
            page: window.location.pathname
        });
    }
});
