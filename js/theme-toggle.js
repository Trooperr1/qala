// ============================================
// DARK/LIGHT THEME TOGGLE
// ============================================

function initThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        toggleButton.innerHTML = '🌙'; // Moon icon for dark mode (default)
        document.body.appendChild(toggleButton);
    }

    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to dark theme
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme on page load
    if (currentTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '☀️'; // Sun icon for light mode
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        // Update icon and save preference
        if (body.classList.contains('light-theme')) {
            themeToggle.innerHTML = '☀️'; // Sun icon
            localStorage.setItem('theme', 'light');

            // Track in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'event_category': 'engagement',
                    'event_label': 'Light Mode'
                });
            }
        } else {
            themeToggle.innerHTML = '🌙'; // Moon icon
            localStorage.setItem('theme', 'dark');

            // Track in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'theme_change', {
                    'event_category': 'engagement',
                    'event_label': 'Dark Mode'
                });
            }
        }

        // Add a subtle animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });

    // Optional: Automatically switch based on system preference
    // Uncomment the code below if you want to respect system theme preference

    /*
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Only apply system preference if user hasn't manually chosen a theme
    if (!localStorage.getItem('theme')) {
        if (prefersDark.matches) {
            body.classList.remove('light-theme');
            themeToggle.innerHTML = '🌙';
        } else {
            body.classList.add('light-theme');
            themeToggle.innerHTML = '☀️';
        }
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.remove('light-theme');
                themeToggle.innerHTML = '🌙';
            } else {
                body.classList.add('light-theme');
                themeToggle.innerHTML = '☀️';
            }
        }
    });
    */
}

// Initialize theme toggle when DOM is ready
document.addEventListener('DOMContentLoaded', initThemeToggle);
