/**
 * JAFF STUDIO - Newsletter Signup System
 *
 * Features:
 * - Multiple signup forms across the site
 * - Popup modal for exit-intent or time-delay
 * - Integration-ready for email services
 * - Validation and user feedback
 */

class NewsletterSystem {
    constructor() {
        this.emailService = 'demo'; // Change to 'mailchimp', 'convertkit', etc.
        this.apiEndpoint = ''; // Add your email service API endpoint
        this.init();
    }

    init() {
        this.createNewsletterPopup();
        this.attachFormHandlers();
        this.initPopupTriggers();
    }

    createNewsletterPopup() {
        const popup = document.createElement('div');
        popup.id = 'newsletter-popup';
        popup.className = 'newsletter-popup';
        popup.innerHTML = `
            <div class="newsletter-overlay"></div>
            <div class="newsletter-modal">
                <button class="newsletter-close" onclick="newsletterSystem.closePopup()">&times;</button>

                <div class="newsletter-content">
                    <div class="newsletter-icon">📧</div>
                    <h2 class="newsletter-title">Stay Ahead of the Curve</h2>
                    <p class="newsletter-subtitle">
                        Get weekly insights on AI, web development, and digital transformation.
                        Join 500+ entrepreneurs and developers.
                    </p>

                    <form class="newsletter-form" id="popup-newsletter-form">
                        <div class="form-row">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                                class="newsletter-input"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                required
                                class="newsletter-input"
                            />
                        </div>
                        <button type="submit" class="newsletter-submit">
                            Subscribe Now →
                        </button>
                        <p class="newsletter-privacy">
                            <small>No spam ever. Unsubscribe anytime. Read our
                                <a href="legal-pages/privacy-policy.html">Privacy Policy</a>.
                            </small>
                        </p>
                    </form>

                    <div class="newsletter-benefits">
                        <div class="benefit">
                            <span class="benefit-icon">✅</span>
                            <span>Weekly expert tips & guides</span>
                        </div>
                        <div class="benefit">
                            <span class="benefit-icon">✅</span>
                            <span>Exclusive resources & templates</span>
                        </div>
                        <div class="benefit">
                            <span class="benefit-icon">✅</span>
                            <span>Early access to new services</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
    }

    attachFormHandlers() {
        // Popup form
        const popupForm = document.getElementById('popup-newsletter-form');
        if (popupForm) {
            popupForm.addEventListener('submit', (e) => this.handleSubmit(e, 'popup'));
        }

        // Inline forms (footer, blog, etc.)
        document.querySelectorAll('.newsletter-inline-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, 'inline'));
        });
    }

    async handleSubmit(e, source) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const name = formData.get('name') || '';

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Send to email service
            const result = await this.subscribe(email, name, source);

            if (result.success) {
                this.showSuccess(form, source);

                // Track conversion
                if (typeof ConversionTracker !== 'undefined') {
                    ConversionTracker.track('newsletter_subscribed', {
                        source: source,
                        email: email
                    });
                }

                // Close popup after success
                if (source === 'popup') {
                    setTimeout(() => this.closePopup(), 2000);
                }
            } else {
                this.showError(form, result.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            this.showError(form, 'Network error. Please check your connection.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async subscribe(email, name, source) {
        // Demo mode - just simulate success
        if (this.emailService === 'demo') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            console.log('Newsletter subscription (demo):', { email, name, source });
            return { success: true };
        }

        // Mailchimp integration example
        if (this.emailService === 'mailchimp') {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: name.split(' ')[0] || '',
                        LNAME: name.split(' ')[1] || '',
                        SOURCE: source
                    }
                })
            });

            return await response.json();
        }

        // ConvertKit integration example
        if (this.emailService === 'convertkit') {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    first_name: name,
                    tags: [source]
                })
            });

            return await response.json();
        }

        // FormSubmit integration (free, no backend needed)
        if (this.emailService === 'formsubmit') {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    _subject: 'New Newsletter Subscription!',
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            return { success: response.ok };
        }

        return { success: false, message: 'Email service not configured' };
    }

    showSuccess(form, source) {
        const successMessage = document.createElement('div');
        successMessage.className = 'newsletter-message newsletter-success';
        successMessage.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <strong>Success!</strong> Check your email to confirm your subscription.
        `;

        form.style.display = 'none';
        form.parentElement.appendChild(successMessage);

        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = '';
            successMessage.remove();
        }, 5000);
    }

    showError(form, message) {
        const existingError = form.querySelector('.newsletter-error');
        if (existingError) existingError.remove();

        const errorMessage = document.createElement('div');
        errorMessage.className = 'newsletter-message newsletter-error';
        errorMessage.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>${message}</span>
        `;

        form.appendChild(errorMessage);

        setTimeout(() => errorMessage.remove(), 5000);
    }

    initPopupTriggers() {
        const cookieName = 'newsletter_popup_shown';

        // Don't show if already subscribed or dismissed recently
        if (this.getCookie(cookieName)) {
            return;
        }

        // Trigger 1: Time delay (show after 30 seconds)
        setTimeout(() => {
            if (!this.getCookie(cookieName)) {
                this.showPopup();
                this.setCookie(cookieName, 'true', 7); // Don't show again for 7 days
            }
        }, 30000);

        // Trigger 2: Scroll depth (show when user scrolls 50%)
        let triggered = false;
        window.addEventListener('scroll', () => {
            if (triggered) return;

            const scrolled = window.pageYOffset;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const percentage = (scrolled / total) * 100;

            if (percentage > 50 && !this.getCookie(cookieName)) {
                triggered = true;
                this.showPopup();
                this.setCookie(cookieName, 'true', 7);
            }
        }, { passive: true });
    }

    showPopup() {
        const popup = document.getElementById('newsletter-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closePopup() {
        const popup = document.getElementById('newsletter-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.setTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }
}

// Initialize newsletter system
let newsletterSystem;
document.addEventListener('DOMContentLoaded', () => {
    newsletterSystem = new NewsletterSystem();
});
