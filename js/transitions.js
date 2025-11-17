/**
 * JAFF STUDIO - Smooth Page Transitions
 * Adds smooth fade transitions when navigating between pages
 */

class PageTransitions {
    constructor() {
        this.transitionDuration = 250; // milliseconds - faster for snappier feel
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Add page-loaded class after initial load
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
        });

        // Add fade-in on page load
        this.fadeInPage();

        // Intercept all internal link clicks
        this.attachLinkListeners();

        // Handle browser back/forward buttons
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                // Page was loaded from cache (back/forward button)
                document.body.classList.remove('page-transitioning');
                document.body.classList.add('page-loaded');
            }
        });

        // Smooth scroll to sections within the same page
        this.setupSmoothScrolling();
    }

    fadeInPage() {
        // Remove transitioning class and add loaded class
        document.body.classList.remove('page-transitioning');
        document.body.classList.add('page-loaded');
    }

    attachLinkListeners() {
        // Page transitions disabled - all navigation uses instant loading
        // Only smooth scrolling for anchor links is active
    }

    transitionToPage(url) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Add transitioning class for fade-out effect
        document.body.classList.remove('page-loaded');
        document.body.classList.add('page-transitioning');

        // Navigate after transition (removed scroll-to-top for faster navigation)
        setTimeout(() => {
            window.location.href = url;
        }, this.transitionDuration);
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links on same page
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip empty anchors
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerOffset = 100; // Account for fixed header
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }
}

// Initialize page transitions
const pageTransitions = new PageTransitions();

// Export for external access
window.pageTransitions = pageTransitions;
