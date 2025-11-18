// ============================================
// BEFORE/AFTER IMAGE SLIDER
// ============================================

function initBeforeAfterSlider() {
    const containers = document.querySelectorAll('.before-after-container');

    containers.forEach(container => {
        const slider = container.querySelector('.before-after-slider');
        const afterImage = container.querySelector('.after-image');

        if (!slider || !afterImage) return;

        let isDragging = false;

        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        // Touch events for mobile
        slider.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);

        function startDrag(e) {
            isDragging = true;
            slider.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function stopDrag() {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }

        function drag(e) {
            if (!isDragging) return;

            const containerRect = container.getBoundingClientRect();
            let x;

            if (e.type.includes('touch')) {
                x = e.touches[0].clientX - containerRect.left;
            } else {
                x = e.clientX - containerRect.left;
            }

            // Constrain x within container bounds
            x = Math.max(0, Math.min(x, containerRect.width));

            const percentage = (x / containerRect.width) * 100;

            // Update slider position
            slider.style.left = `${percentage}%`;

            // Update after image clip-path
            afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
        }

        // Optional: Click anywhere to move slider
        container.addEventListener('click', (e) => {
            if (e.target === slider || e.target.closest('.before-after-slider')) return;

            const containerRect = container.getBoundingClientRect();
            const x = e.clientX - containerRect.left;
            const percentage = (x / containerRect.width) * 100;

            slider.style.left = `${percentage}%`;
            afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;

            // Animate slider
            slider.style.transition = 'left 0.3s ease';
            afterImage.style.transition = 'clip-path 0.3s ease';

            setTimeout(() => {
                slider.style.transition = '';
                afterImage.style.transition = '';
            }, 300);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initBeforeAfterSlider);
