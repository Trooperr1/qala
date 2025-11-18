# JAFF STUDIO - Deployment Checklist

## Pre-Deployment: Replace Placeholders

### 1. Google Analytics
- [ ] **File**: `index.html`, `about.html`, `services.html`, `portfolio.html`, `contact.html`, `faq.html`
- [ ] **Find**: `G-XXXXXXXXXX`
- [ ] **Replace with**: Your actual Google Analytics 4 measurement ID
- [ ] **Location**: In `<!-- Google Analytics -->` script tags near bottom of each page

### 2. Phone Numbers
- [ ] **File**: `contact.html`, `index.html`, footer sections across all pages
- [ ] **Find**: `+41 XX XXX XX XX`
- [ ] **Replace with**: Your actual Swiss phone number(s)
- [ ] **Locations**:
  - Contact page contact information
  - Footer contact details
  - Hero section CTAs

### 3. WhatsApp Integration
- [ ] **File**: `index.html`, `about.html`, `services.html`, `portfolio.html`, `contact.html`, `faq.html`
- [ ] **Find**: `1234567890` in WhatsApp links
- [ ] **Replace with**: Your WhatsApp number (with country code, no + or spaces)
- [ ] **Format**: For Swiss number +41 79 123 45 67, use: `41791234567`

### 4. Email Addresses
- [ ] **File**: `contact.html`, footer sections
- [ ] **Find**: `info@jaffstudio.ch`, `contact@jaffstudio.ch`
- [ ] **Verify**: These emails are set up and working
- [ ] **Alternative**: Replace with your actual email if different

### 5. Company Registration
- [ ] **File**: Footer sections across all pages
- [ ] **Find**: `CHE-XXX.XXX.XXX` (Swiss UID placeholder)
- [ ] **Replace with**: Your actual Swiss company registration number
- [ ] **Location**: Footer legal text

### 6. Social Media Links
- [ ] **File**: Footer sections across all pages
- [ ] **Find**: `#` placeholders for Facebook, Instagram, LinkedIn, Twitter
- [ ] **Replace with**: Your actual social media profile URLs
- [ ] **Alternative**: Remove unused social links

### 7. Portfolio Images
- [ ] **File**: `portfolio.html`
- [ ] **Verify**: All `images/portfolio/*.jpg` files exist
- [ ] **Check**: Replace placeholder images with actual project photos
- [ ] **Optimize**: Compress images for web (use tools like TinyPNG)

### 8. Testimonials
- [ ] **File**: `index.html`, `about.html`
- [ ] **Verify**: Client testimonials are real and approved for use
- [ ] **Replace**: Generic testimonials with actual client feedback

## Technical Checks

### 9. External Dependencies (Already Working)
- [x] Three.js (particles background)
- [x] GSAP & ScrollTrigger (animations)
- [x] Google Translate
- [x] Font Awesome icons
- [x] Google Fonts (Poppins)

### 10. Browser Testing
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile Chrome (Android)
- [ ] Test on mobile Safari (iOS)

### 11. Forms Testing
- [ ] **Contact Form**: Verify form submission works
- [ ] **Newsletter**: Test email capture functionality
- [ ] **FAQ Search**: Verify search filters questions correctly
- [ ] **Portfolio Filter**: Test all 5 filter buttons

### 12. Performance
- [ ] Test page load speed (use PageSpeed Insights)
- [ ] Verify images are optimized
- [ ] Check mobile performance
- [ ] Test on slower connections

### 13. SEO
- [ ] Verify all pages have unique `<title>` tags
- [ ] Check all pages have meta descriptions
- [ ] Verify Open Graph tags for social sharing
- [ ] Test with Google's Rich Results Test

## Legal & Compliance

### 14. Legal Pages
- [x] Privacy Policy (`privacy.html`)
- [x] Terms of Service (`terms.html`)
- [x] Cookie Policy (`cookie-policy.html`)
- [x] Imprint (`imprint.html`)
- [x] Disclaimer (`disclaimer.html`)
- [ ] **Review**: Customize legal templates with your company info
- [ ] **Legal Review**: Have a lawyer review legal pages

### 15. GDPR Compliance
- [x] Cookie consent banner implemented
- [ ] Verify cookie consent saves properly
- [ ] Test "Reject All" functionality
- [ ] Ensure analytics respects user consent

## Deployment

### 16. Domain & Hosting
- [ ] Domain name registered (`jaffstudio.ch` or your chosen domain)
- [ ] SSL certificate (HTTPS) - automatic on Netlify/GitHub Pages
- [ ] DNS configured correctly
- [ ] WWW redirect set up (if needed)

### 17. Git & Version Control
- [x] All changes committed to branch `claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`
- [x] Code pushed to GitHub
- [ ] Consider creating a `production` or `main` branch for live site

### 18. Post-Deployment
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics goals/events
- [ ] Monitor 404 errors
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Create backups schedule

## Quick Deployment Options

### Option A: Netlify (Recommended - Easiest)
1. Sign up at https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Set build settings: None needed (static site)
5. Click "Deploy site"
6. Configure custom domain in Site settings

### Option B: GitHub Pages
1. Go to repository Settings → Pages
2. Source: Deploy from branch
3. Branch: `claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`
4. Folder: `/ (root)`
5. Save - site deploys to `username.github.io/qala`
6. Configure custom domain if needed

### Option C: Traditional Hosting (cPanel/FTP)
1. Export all files from repository
2. Upload via FTP to `public_html` or `www` folder
3. Ensure proper file permissions (644 for files, 755 for folders)
4. Configure SSL certificate in hosting panel

## Final Checks
- [ ] All forms submit correctly on live site
- [ ] All links work (no 404s)
- [ ] Mobile menu works on actual devices
- [ ] Analytics tracking is active
- [ ] Cookie consent works correctly
- [ ] WhatsApp link opens correctly on mobile

---

**Your website has 3 commits and is ready to deploy!**

Current branch: `claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`

Total files: 22 (HTML, CSS, JS, legal pages, images)
