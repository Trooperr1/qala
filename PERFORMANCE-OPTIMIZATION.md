# Performance Optimization Guide

## Overview

This guide covers all performance optimization features implemented for JAFF STUDIO website.

## ✅ Implemented Features

### 1. Lazy Loading System
- **What it does**: Delays loading images/iframes until they're about to enter the viewport
- **Impact**: Faster initial page load, reduced bandwidth usage
- **How to use**: Add `data-src` instead of `src` to images:
  ```html
  <!-- Before -->
  <img src="image.jpg" alt="Description">

  <!-- After (lazy loaded) -->
  <img data-src="image.jpg" alt="Description" class="lazy">
  ```

### 2. WebP Image Support
- **What it does**: Automatically detects WebP support and serves optimal format
- **Impact**: 25-35% smaller image file sizes
- **How to convert images**:
  ```bash
  # Install cwebp (one-time)
  brew install webp  # Mac
  sudo apt-get install webp  # Linux

  # Convert images
  cwebp -q 80 input.jpg -o output.webp

  # Batch convert all JPGs
  for img in *.jpg; do cwebp -q 80 "$img" -o "${img%.jpg}.webp"; done
  ```

### 3. Service Worker (Offline Capability)
- **What it does**: Caches website files for offline access
- **Impact**: Instant loading on repeat visits, works offline
- **Status**: Auto-enabled, no configuration needed
- **How to test**:
  1. Open website in browser
  2. Open DevTools → Application → Service Workers
  3. Check "Offline" mode
  4. Refresh page - should still work!

### 4. Performance Monitoring
- **What it does**: Tracks and reports page load metrics
- **Impact**: Identifies performance bottlenecks
- **How to view**: Open browser console → Look for "⚡ Performance Metrics"
- **Metrics tracked**:
  - Page Load Time
  - Time to First Byte (TTFB)
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Resource breakdown

### 5. Resource Hints
- **What it does**: Preconnects to external domains for faster loading
- **Impact**: Reduces DNS lookup and connection time
- **Domains optimized**:
  - Google Fonts
  - CDN resources
  - Analytics

---

## 🚀 CSS/JS Minification

### Why Minify?
- **Size reduction**: 40-60% smaller files
- **Faster loading**: Less data to download
- **Better SEO**: Google prefers fast sites

### Option 1: Online Tools (Easiest)
1. Go to https://www.minifier.org/
2. Copy your CSS/JS file content
3. Click "Minify"
4. Save as `filename.min.css` or `filename.min.js`

### Option 2: Command Line (Recommended)

#### Install Tools
```bash
# Install Node.js if not installed
# Then install minification tools
npm install -g csso-cli terser
```

#### Minify CSS
```bash
# Single file
csso styles.css -o styles.min.css

# All CSS files
for file in css/*.css; do
  csso "$file" -o "${file%.css}.min.css"
done
```

#### Minify JavaScript
```bash
# Single file
terser scripts.js -c -m -o scripts.min.js

# All JS files
for file in js/*.js; do
  terser "$file" -c -m -o "${file%.js}.min.js"
done
```

### Option 3: Automated Build Process
Create `package.json`:
```json
{
  "name": "jaff-studio",
  "version": "1.0.0",
  "scripts": {
    "minify:css": "csso css/styles.css -o css/styles.min.css",
    "minify:js": "terser js/scripts.js -c -m -o js/scripts.min.js",
    "minify:all": "npm run minify:css && npm run minify:js",
    "watch": "npm run minify:all && watch 'npm run minify:all' css js"
  },
  "devDependencies": {
    "csso-cli": "^4.0.2",
    "terser": "^5.19.0"
  }
}
```

Run with:
```bash
npm install
npm run minify:all
```

### Update HTML References
After minifying, update your HTML:
```html
<!-- Before -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/scripts.js"></script>

<!-- After -->
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/scripts.min.js"></script>
```

---

## 📊 Performance Testing

### Test Your Performance
1. **Google PageSpeed Insights**: https://pagespeed.web.dev/
   - Enter your URL
   - Target: 90+ score

2. **GTmetrix**: https://gtmetrix.com/
   - Detailed waterfall analysis
   - Target: A grade

3. **WebPageTest**: https://www.webpagetest.org/
   - Advanced metrics
   - Multiple location testing

### Performance Targets
- **Page Load Time**: < 2 seconds
- **Time to First Byte**: < 600ms
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Total Page Size**: < 3MB
- **Number of Requests**: < 50

---

## 🎯 Performance Checklist

### Images
- [ ] Convert to WebP format (+ keep JPG fallback)
- [ ] Compress images (use TinyPNG or ImageOptim)
- [ ] Add lazy loading (`data-src`)
- [ ] Use appropriate sizes (no 4K images for thumbnails!)
- [ ] Add `width` and `height` attributes to prevent layout shift

### CSS
- [ ] Minify all CSS files
- [ ] Remove unused CSS
- [ ] Use critical CSS for above-the-fold content
- [ ] Load non-critical CSS asynchronously

### JavaScript
- [ ] Minify all JS files
- [ ] Remove console.log statements in production
- [ ] Defer non-critical scripts
- [ ] Use async for third-party scripts

### Fonts
- [ ] Use `font-display: swap` to prevent invisible text
- [ ] Preload critical fonts
- [ ] Subset fonts to include only needed characters

### Hosting
- [ ] Enable GZIP/Brotli compression
- [ ] Set up CDN (Cloudflare recommended)
- [ ] Enable browser caching headers
- [ ] Use HTTP/2 or HTTP/3

---

## 🔧 Advanced Optimizations

### 1. Critical CSS
Extract above-the-fold CSS and inline it:
```html
<head>
  <style>
    /* Critical CSS here - styles needed for initial viewport */
  </style>

  <!-- Load full CSS async -->
  <link rel="preload" href="css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### 2. Preload Important Resources
```html
<link rel="preload" href="fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="images/hero.webp" as="image">
```

### 3. DNS Prefetch & Preconnect
```html
<link rel="dns-prefetch" href="https://www.google-analytics.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### 4. Image Optimization Script
```bash
#!/bin/bash
# optimize-images.sh

echo "Optimizing images..."

# Install dependencies if needed
command -v cwebp >/dev/null 2>&1 || { echo "Installing webp..."; brew install webp; }
command -v jpegoptim >/dev/null 2>&1 || { echo "Installing jpegoptim..."; brew install jpegoptim; }
command -v optipng >/dev/null 2>&1 || { echo "Installing optipng..."; brew install optipng; }

# Optimize JPEGs
find . -name "*.jpg" -o -name "*.jpeg" | while read img; do
  echo "Optimizing $img"
  jpegoptim --strip-all --max=85 "$img"
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done

# Optimize PNGs
find . -name "*.png" | while read img; do
  echo "Optimizing $img"
  optipng -o5 "$img"
  cwebp -q 80 "$img" -o "${img%.*}.webp"
done

echo "✅ Image optimization complete!"
```

---

## 📈 Monitoring Performance

### 1. Real User Monitoring (RUM)
```javascript
// Track real user performance
window.addEventListener('load', () => {
  const perfData = window.performanceOptimizer.getMetrics();

  // Send to your analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_performance', {
      load_time: perfData.pageLoadTime,
      fcp: perfData.firstContentfulPaint
    });
  }
});
```

### 2. Performance Budget
Set limits in your CI/CD:
```json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "total", "budget": 3000 },
        { "resourceType": "script", "budget": 500 },
        { "resourceType": "stylesheet", "budget": 300 },
        { "resourceType": "image", "budget": 1500 }
      ]
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Service Worker Issues
```javascript
// Unregister all service workers (emergency)
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

// Clear cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Lazy Loading Not Working
1. Check console for errors
2. Verify images have `data-src` attribute
3. Ensure `performance.js` is loaded
4. Test in incognito mode (extensions might interfere)

### Performance Still Slow
1. Check server response time (TTFB)
2. Verify CDN is working
3. Check for render-blocking resources
4. Test with throttled connection

---

## 📚 Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Can I Use (Browser Support)](https://caniuse.com/)
- [WebP Converter](https://developers.google.com/speed/webp)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🎯 Next Steps

1. **Test current performance**: Run PageSpeed Insights
2. **Convert images to WebP**: Use the batch script above
3. **Minify CSS/JS**: Use the minification tools
4. **Deploy**: Push changes to production
5. **Monitor**: Check performance weekly

**Target Goal**: Sub-2-second load times with 90+ PageSpeed score

---

**Need help?** Check browser console for performance metrics or create an issue.
