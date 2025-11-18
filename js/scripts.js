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

// GSAP Scroll Animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.service-card, .glass-card, .portfolio-item').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1
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
    initScrollAnimations();
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
