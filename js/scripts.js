// JAFF STUDIO - Shared JavaScript

// THREE.JS 3D Background - BLACK & WHITE
function init3DBackground() {
    const canvas = document.getElementById('canvas-3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Particle System - White particles (reduce for mobile)
    const particlesGeometry = new THREE.BufferGeometry();
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 800 : 2000;
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

    // 3D Geometric Shapes - White wireframe
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Mouse Movement
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0002;

        torus.rotation.x += 0.002;
        torus.rotation.y += 0.003;

        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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

// Initialize all functions on page load
document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initFAQ();
    initBackToTop();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    setActiveNavLink();
});

// Make googleTranslateElementInit available globally
window.googleTranslateElementInit = googleTranslateElementInit;
