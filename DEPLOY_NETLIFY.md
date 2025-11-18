# Deploy JAFF STUDIO to Netlify

## Why Netlify?
- **Free HTTPS** - Automatic SSL certificates
- **Lightning Fast CDN** - Global content delivery
- **Easy Deployment** - Deploy in 2 minutes
- **Custom Domain** - Connect jaffstudio.ch easily
- **Automatic Builds** - Updates when you push to GitHub

## Step-by-Step Deployment

### Step 1: Sign Up for Netlify
1. Go to https://netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest option)
4. Authorize Netlify to access your GitHub repositories

### Step 2: Create New Site
1. Click the "Add new site" button
2. Select "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify (if prompted)

### Step 3: Select Repository
1. Find your repository in the list (or search for "qala")
2. Click on the repository name
3. You'll see the deployment configuration screen

### Step 4: Configure Build Settings
Since this is a static HTML site, use these settings:

- **Branch to deploy**: `claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`
- **Build command**: Leave empty (or enter `echo "Static site"`)
- **Publish directory**: Leave empty or enter `/` (root)
- **Advanced build settings**: No changes needed

Click "Deploy site"

### Step 5: Wait for Deployment
- Netlify will start building your site (takes 30-60 seconds)
- You'll see a deploy log showing progress
- When complete, you'll see "Published" with a green checkmark

### Step 6: View Your Live Site
- Netlify assigns a random URL like: `random-name-123456.netlify.app`
- Click the URL to view your live website
- Test all pages and features

### Step 7: Connect Custom Domain (Optional)

#### If you own jaffstudio.ch:

1. In Netlify, go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Enter `jaffstudio.ch`
4. Netlify will verify ownership

5. **Configure DNS** (at your domain registrar):

   **Option A: Use Netlify DNS (Recommended)**
   - Netlify will show you nameservers to use
   - Go to your domain registrar (where you bought jaffstudio.ch)
   - Update nameservers to Netlify's nameservers
   - Wait 24-48 hours for DNS propagation

   **Option B: Keep existing DNS**
   - Add an A record pointing to Netlify's load balancer IP: `75.2.60.5`
   - Add a CNAME record: `www` pointing to `random-name-123456.netlify.app`

6. **Enable HTTPS**
   - After DNS is configured, go to **Site settings** → **Domain management** → **HTTPS**
   - Click "Verify DNS configuration"
   - Click "Provision certificate" (automatic and free)
   - Wait a few minutes for SSL to activate

### Step 8: Configure Redirects (Recommended)

Create a `_redirects` file in your project root to handle common issues:

```
# Redirect www to non-www
https://www.jaffstudio.ch/* https://jaffstudio.ch/:splat 301!

# Redirect default Netlify domain to custom domain
https://random-name-123456.netlify.app/* https://jaffstudio.ch/:splat 301!

# 404 page
/*  /index.html  404
```

### Step 9: Environment Variables (If Needed)

If you need to store sensitive data:
1. Go to **Site settings** → **Environment variables**
2. Add variables like `FORM_ENDPOINT`, `API_KEY`, etc.
3. Reference in your code

### Step 10: Set Up Form Handling

Netlify has built-in form handling! Update your contact form:

**In contact.html**, change the form tag:
```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact">
  <!-- your existing form fields -->
</form>
```

Netlify will automatically:
- Capture form submissions
- Send you email notifications
- Store submissions in Netlify dashboard

## Post-Deployment Checklist

- [ ] Site loads correctly at Netlify URL
- [ ] All pages are accessible
- [ ] Images load properly
- [ ] Three.js particles animation works
- [ ] GSAP scroll animations work
- [ ] Portfolio filter buttons work
- [ ] FAQ search works
- [ ] Newsletter modal appears after 8 seconds
- [ ] Contact form submits (test it!)
- [ ] Mobile menu works on phone
- [ ] WhatsApp link works on mobile

## Continuous Deployment

**Automatic Updates**: Every time you push to the branch `claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`, Netlify will automatically rebuild and deploy your site!

To update your site:
1. Make changes to files
2. Commit: `git add . && git commit -m "Update content"`
3. Push: `git push -u origin claude/build-agency-website-01VoKMvvH4rbLv9CqiyG9rYn`
4. Wait 1-2 minutes - your site is automatically updated!

## Troubleshooting

### Issue: Site shows 404
- **Fix**: Check "Publish directory" is `/` or empty
- **Fix**: Verify branch name is correct

### Issue: Images not loading
- **Fix**: Ensure all image paths are relative (e.g., `images/logo.svg` not `/images/logo.svg`)
- **Fix**: Check image files are committed to repository

### Issue: JavaScript not working
- **Fix**: Check browser console for errors
- **Fix**: Verify all external CDN links are HTTPS

### Issue: Forms not submitting
- **Fix**: Add `data-netlify="true"` to form tag
- **Fix**: Add hidden input: `<input type="hidden" name="form-name" value="contact">`

### Issue: Custom domain not working
- **Fix**: Wait 24-48 hours for DNS propagation
- **Fix**: Use `dig jaffstudio.ch` to verify DNS records
- **Fix**: Check DNS configuration in Netlify dashboard

## Advanced Features

### Deploy Previews
- Every pull request gets a unique preview URL
- Test changes before merging to main branch

### Branch Deploys
- Deploy multiple branches simultaneously
- Useful for staging/production environments

### Analytics
- Enable Netlify Analytics ($9/month) for privacy-friendly visitor stats
- Or stick with Google Analytics (already configured)

### Functions (Serverless)
- Add backend functionality without a server
- Useful for API endpoints, form processing, etc.

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Community Forum**: https://answers.netlify.com
- **Status Page**: https://www.netlifystatus.com

---

**Estimated deployment time: 5-10 minutes**
**Cost: FREE (100GB bandwidth/month, 300 build minutes/month)**

Your site is ready to go live! 🚀
