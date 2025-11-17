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

    // Optimized Three.js background initialization
    function initOptimized3DBackground() {
        // Only initialize if Three.js is loaded and viewport is large enough
        if (typeof THREE === 'undefined' || window.innerWidth < 768) {
            // Hide canvas on mobile or if Three.js not loaded
            const canvas = document.getElementById('canvas-3d');
            if (canvas) canvas.style.display = 'none';
            return;
        }

        const canvas = document.getElementById('canvas-3d');
        if (!canvas) return;

        // Reduce quality for better performance
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: false, // Disable antialiasing for better performance
            powerPreference: 'high-performance'
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio

        // Simpler geometry for better performance
        const geometry = new THREE.IcosahedronGeometry(1, 0); // Reduced detail
        const material = new THREE.MeshBasicMaterial({
            color: 0x667eea,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });

        const particles = [];
        const particleCount = 30; // Reduced from potentially higher count

        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(geometry, material);
            particle.position.x = (Math.random() - 0.5) * 20;
            particle.position.y = (Math.random() - 0.5) * 20;
            particle.position.z = (Math.random() - 0.5) * 20;
            particle.rotation.x = Math.random() * Math.PI;
            particle.rotation.y = Math.random() * Math.PI;
            scene.add(particle);
            particles.push(particle);
        }

        camera.position.z = 15;

        // Use requestAnimationFrame with throttling
        let lastFrameTime = Date.now();
        const targetFPS = 30; // Lower FPS for better battery/performance
        const frameInterval = 1000 / targetFPS;

        function animate() {
            requestAnimationFrame(animate);

            const now = Date.now();
            const delta = now - lastFrameTime;

            if (delta > frameInterval) {
                lastFrameTime = now - (delta % frameInterval);

                // Simple rotation
                particles.forEach(particle => {
                    particle.rotation.x += 0.001;
                    particle.rotation.y += 0.001;
                });

                renderer.render(scene, camera);
            }
        }

        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                renderer.setAnimationLoop(null);
            } else {
                animate();
            }
        });

        // Responsive resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 250);
        });

        animate();
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Delay 3D background init to not block initial render
            setTimeout(initOptimized3DBackground, 100);
        });
    } else {
        setTimeout(initOptimized3DBackground, 100);
    }

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
