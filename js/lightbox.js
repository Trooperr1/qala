// ============================================
// IMAGE LIGHTBOX
// ============================================
function initLightbox() {
    // Create lightbox HTML if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        const lightboxHTML = `
            <div class="lightbox" id="lightbox">
                <div class="lightbox-content">
                    <span class="lightbox-counter" id="lightboxCounter"></span>
                    <button class="lightbox-close" id="lightboxClose">&times;</button>
                    <button class="lightbox-nav lightbox-prev" id="lightboxPrev">‹</button>
                    <button class="lightbox-nav lightbox-next" id="lightboxNext">›</button>
                    <img src="" alt="" id="lightboxImage">
                    <div class="lightbox-caption" id="lightboxCaption"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Get all images that should open in lightbox
    const galleryImages = document.querySelectorAll('.portfolio-item img, .case-study-image, .lightbox-trigger');
    let currentImageIndex = 0;
    let imageArray = [];

    // Build image array
    galleryImages.forEach((img, index) => {
        imageArray.push({
            src: img.src,
            alt: img.alt || '',
            caption: img.getAttribute('data-caption') || img.alt || ''
        });

        // Add click event to open lightbox
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function updateLightboxContent() {
        const currentImage = imageArray[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${imageArray.length}`;

        // Show/hide nav buttons
        lightboxPrev.style.display = currentImageIndex === 0 ? 'none' : 'flex';
        lightboxNext.style.display = currentImageIndex === imageArray.length - 1 ? 'none' : 'flex';
    }

    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxContent();
        }
    }

    function showNextImage() {
        if (currentImageIndex < imageArray.length - 1) {
            currentImageIndex++;
            updateLightboxContent();
        }
    }

    // Event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', initLightbox);
