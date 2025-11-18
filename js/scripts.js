// JAFF STUDIO - Shared JavaScript

// THREE.JS 3D Background - BLACK & WHITE (Optimized)
function init3DBackground() {
    // Wait for Three.js to load
    if (typeof THREE === 'undefined') {
        console.log('Three.js not loaded yet, will retry...');
        setTimeout(init3DBackground, 100);
        return;
    }

    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Optimized renderer settings
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.innerWidth > 1024, // Only on desktop
        powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Particle System - White particles (optimized counts)
    const particlesGeometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 500 : 1500; // Slightly reduced for performance
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 3D Geometric Shapes - White wireframe torus
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Mouse Movement (interactive)
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);

        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0002;

        torus.rotation.x += 0.002;
        torus.rotation.y += 0.003;

        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    // Pause when tab not visible (save battery/CPU)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationId) cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    animate();

    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250);
    });
}

// FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const wasActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// Back to Top
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        });
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });

    // Prevent body scroll when mobile menu is open
    const body = document.body;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                if (mobileMenu.classList.contains('active')) {
                    body.style.overflow = 'hidden';
                } else {
                    body.style.overflow = '';
                }
            }
        });
    });
    observer.observe(mobileMenu, { attributes: true });
}

// Set Active Navigation Link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,de,fr,it,es,pt,nl,ru,zh-CN,ja,ko,ar,hi,tr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Animated Counter
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            // Format decimals for numbers with decimals
                            if (target % 1 !== 0) {
                                counter.textContent = current.toFixed(1);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                            requestAnimationFrame(updateCounter);
                        } else {
                            // Final value
                            if (target % 1 !== 0) {
                                counter.textContent = target.toFixed(1);
                            } else {
                                counter.textContent = target;
                            }
                        }
                    };

                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// Initialize all functions on page load
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initFAQ();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
    setActiveNavLink();
    initAnimatedCounters();
});

// Make googleTranslateElementInit available globally
window.googleTranslateElementInit = googleTranslateElementInit;

// ============================================
// COOKIE CONSENT BANNER
// ============================================
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');

    if (!cookieBanner) return;

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');

    if (!cookieChoice) {
        // Show banner after a short delay for better UX
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 1000);
    }

    // Accept cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideBanner();
            // Enable analytics/tracking here if needed
            console.log('Cookies accepted');
        });
    }

    // Reject cookies
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
            hideBanner();
            console.log('Cookies rejected');
        });
    }

    function hideBanner() {
        cookieBanner.style.animation = 'slideDownFade 0.3s ease-out forwards';
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 300);
    }
}

// Add slideDownFade animation dynamically
const styleSheet = document.styleSheets[0];
const slideDownAnimation = `
@keyframes slideDownFade {
    from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    to {
        opacity: 0;
        transform: translateX(-50%) translateY(30px);
    }
}`;
styleSheet.insertRule(slideDownAnimation, styleSheet.cssRules.length);

// Initialize cookie consent on page load
document.addEventListener('DOMContentLoaded', initCookieConsent);

// ============================================
// ACTIVE NAVIGATION STATE
// ============================================
function setActiveNavigation() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Check if link matches current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize active navigation on page load
document.addEventListener('DOMContentLoaded', setActiveNavigation);

// ============================================
// FORM VALIDATION & UX ENHANCEMENTS
// ============================================
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    // Real-time validation functions
    function validateName(input) {
        const error = document.getElementById('name-error');
        if (!input.value.trim()) {
            showError(input, error, 'Name is required');
            return false;
        }
        if (input.value.trim().length < 2) {
            showError(input, error, 'Name must be at least 2 characters');
            return false;
        }
        showSuccess(input, error);
        return true;
    }

    function validateEmail(input) {
        const error = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!input.value.trim()) {
            showError(input, error, 'Email is required');
            return false;
        }
        if (!emailRegex.test(input.value)) {
            showError(input, error, 'Please enter a valid email address');
            return false;
        }
        showSuccess(input, error);
        return true;
    }

    function validateMessage(input) {
        const error = document.getElementById('message-error');
        if (!input.value.trim()) {
            showError(input, error, 'Message is required');
            return false;
        }
        if (input.value.trim().length < 10) {
            showError(input, error, 'Message must be at least 10 characters');
            return false;
        }
        showSuccess(input, error);
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Add real-time validation on blur
    if (nameInput) {
        nameInput.addEventListener('blur', () => validateName(nameInput));
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('error')) {
                validateName(nameInput);
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                validateEmail(emailInput);
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('blur', () => validateMessage(messageInput));
        messageInput.addEventListener('input', () => {
            if (messageInput.classList.contains('error')) {
                validateMessage(messageInput);
            }
        });
    }

    // Form submission with loading state
    form.addEventListener('submit', function(e) {
        // Validate all fields before submit
        const isNameValid = nameInput ? validateName(nameInput) : true;
        const isEmailValid = emailInput ? validateEmail(emailInput) : true;
        const isMessageValid = messageInput ? validateMessage(messageInput) : true;

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            e.preventDefault();
            return false;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
        }

        // Note: FormSubmit.co will handle the actual submission and redirect
        // The loading state will be visible until redirect happens
    });
}

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', initFormValidation);

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections on scroll
    gsap.utils.toArray('section').forEach((section, index) => {
        // Skip first section (hero)
        if (index === 0) return;

        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Stagger animate service cards
    gsap.utils.toArray('.service-card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Stagger animate glass cards
    gsap.utils.toArray('.glass-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Animate stats counters when in view
    gsap.utils.toArray('.counter').forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        
        gsap.from(counter, {
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                once: true
            },
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: target > 10 ? 1 : 0.1 },
            onUpdate: function() {
                const val = parseFloat(this.targets()[0].textContent);
                counter.textContent = target > 10 ? Math.ceil(val) : val.toFixed(1);
            }
        });
    });

    // Fade in client logos with stagger
    gsap.utils.toArray('.client-logo').forEach((logo, index) => {
        gsap.from(logo, {
            scrollTrigger: {
                trigger: logo,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            delay: index * 0.08,
            ease: 'back.out(1.2)'
        });
    });
}

// Initialize scroll animations when GSAP is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initScrollAnimations, 100);
    });
} else {
    setTimeout(initScrollAnimations, 100);
}

// ============================================
// INTERACTIVE PRICING CALCULATOR
// ============================================
function initPricingCalculator() {
    const projectSelect = document.getElementById('calc-project-type');
    const addons = document.querySelectorAll('.calc-addon');
    const totalDisplay = document.getElementById('calc-total');

    if (!projectSelect || !totalDisplay) return;

    function calculateTotal() {
        // Get base project cost
        let total = parseInt(projectSelect.value) || 0;

        // Add checked addons
        addons.forEach(addon => {
            if (addon.checked) {
                total += parseInt(addon.value) || 0;
            }
        });

        // Animate the number change
        animateValue(totalDisplay, parseInt(totalDisplay.textContent.replace(/[^0-9]/g, '')) || 0, total, 500);
    }

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString('de-CH') + ' CHF';
        }, 16);
    }

    // Event listeners
    if (projectSelect) {
        projectSelect.addEventListener('change', calculateTotal);
    }

    addons.forEach(addon => {
        addon.addEventListener('change', calculateTotal);
    });
}

// Initialize pricing calculator on page load
document.addEventListener('DOMContentLoaded', initPricingCalculator);

// ============================================
// NEWSLETTER MODAL
// ============================================
function initNewsletterModal() {
    const modal = document.getElementById('newsletterModal');
    const closeBtn = document.getElementById('closeNewsletter');
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');

    if (!modal) return;

    // Check if newsletter was already shown or submitted
    const newsletterShown = localStorage.getItem('newsletterShown');
    const newsletterSubmitted = localStorage.getItem('newsletterSubmitted');

    if (!newsletterShown && !newsletterSubmitted) {
        // Show modal after 8 seconds
        setTimeout(() => {
            modal.style.display = 'flex';
            localStorage.setItem('newsletterShown', 'true');
        }, 8000);
    }

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();

            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                // Store submission in localStorage
                localStorage.setItem('newsletterSubmitted', 'true');
                localStorage.setItem('newsletterEmail', email);

                // Show success message
                form.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <svg class="icon" style="width: 60px; height: 60px; color: var(--accent); margin-bottom: 20px;">
                            <use href="#icon-shield"></use>
                        </svg>
                        <h4 style="color: var(--accent); margin-bottom: 10px;">Thank You!</h4>
                        <p style="color: var(--white-80);">Check your email for your free 10-point website audit worth 500 CHF!</p>
                    </div>
                `;

                // Close modal after 3 seconds
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 3000);
            }
        });
    }
}

// ============================================
// FLOATING CTA
// ============================================
function initFloatingCTA() {
    const floatingCTA = document.getElementById('floatingCTA');

    if (!floatingCTA) return;

    let hasShown = false;

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

        // Show floating CTA after scrolling 30% of page
        if (scrollPercent > 30 && !hasShown) {
            floatingCTA.style.display = 'block';
            hasShown = true;
        } else if (scrollPercent <= 30 && hasShown) {
            floatingCTA.style.display = 'none';
            hasShown = false;
        }
    });
}

// Initialize newsletter modal and floating CTA on page load
document.addEventListener('DOMContentLoaded', () => {
    initNewsletterModal();
    initFloatingCTA();
});

// ============================================
// PORTFOLIO FILTERING
// ============================================
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const caseStudies = document.querySelectorAll('.case-study-card');

    if (filterButtons.length === 0 || caseStudies.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.color = 'var(--white)';
                btn.style.border = '1px solid var(--white-20)';
            });

            button.classList.add('active');
            button.style.background = 'var(--accent)';
            button.style.color = '#000';
            button.style.border = 'none';

            // Filter case studies
            caseStudies.forEach(card => {
                const categories = card.getAttribute('data-category');

                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add hover effects
    filterButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('active')) {
                button.style.background = 'rgba(255, 255, 255, 0.15)';
                button.style.borderColor = 'var(--accent)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.background = 'rgba(255, 255, 255, 0.1)';
                button.style.borderColor = 'var(--white-20)';
            }
        });
    });
}

// Initialize portfolio filter on page load
document.addEventListener('DOMContentLoaded', initPortfolioFilter);

// ============================================
// FAQ SEARCH FUNCTIONALITY
// ============================================
function initFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqCategories = document.querySelectorAll('.faq-category');

    if (!searchInput || faqItems.length === 0) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        // If search is empty, show all
        if (searchTerm === '') {
            faqItems.forEach(item => {
                item.style.display = 'block';
            });
            faqCategories.forEach(category => {
                category.style.display = 'block';
            });
            return;
        }

        // Search through FAQ items
        let hasVisibleItems = false;
        faqCategories.forEach(category => {
            let categoryHasVisibleItems = false;

            const items = category.querySelectorAll('.faq-item');
            items.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    categoryHasVisibleItems = true;
                    hasVisibleItems = true;

                    // Highlight matching text
                    highlightText(item, searchTerm);
                } else {
                    item.style.display = 'none';
                }
            });

            // Hide category if no items match
            if (categoryHasVisibleItems) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });

        // Show "no results" message if needed
        showNoResultsMessage(hasVisibleItems);
    });

    function highlightText(item, searchTerm) {
        // Simple highlight effect - you could enhance this further
        const question = item.querySelector('.faq-question');
        if (question.textContent.toLowerCase().includes(searchTerm)) {
            question.style.background = 'rgba(212, 175, 55, 0.1)';
        } else {
            question.style.background = '';
        }
    }

    function showNoResultsMessage(hasResults) {
        let noResultsMsg = document.getElementById('faq-no-results');

        if (!hasResults) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'faq-no-results';
                noResultsMsg.style.cssText = 'text-align: center; padding: 60px 20px; color: var(--white-60);';
                noResultsMsg.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
                    <h3 style="font-size: 1.5rem; color: var(--white-80); margin-bottom: 10px;">No results found</h3>
                    <p>Try different keywords or <a href="contact.html" style="color: var(--accent); text-decoration: underline;">contact us</a> directly</p>
                `;
                document.querySelector('.faq-container').appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else {
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        }
    }
}

// Initialize FAQ search on page load
document.addEventListener('DOMContentLoaded', initFAQSearch);

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress on page load
document.addEventListener('DOMContentLoaded', initScrollProgress);
