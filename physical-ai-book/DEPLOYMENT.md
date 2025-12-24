# GitHub Pages Deployment Guide

Complete guide for deploying the Physical AI & Humanoid Robotics online book to GitHub Pages using automated GitHub Actions CI/CD.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Understanding the CI/CD Pipeline](#understanding-the-cicd-pipeline)
- [Deployment Verification](#deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)
- [Performance Optimization](#performance-optimization)
- [Security Best Practices](#security-best-practices)

---

## Prerequisites

Before deploying to GitHub Pages, ensure you have:

### Required
- **GitHub Account**: Free account with GitHub Pages enabled
- **Git**: Version 2.28+ installed locally
  ```bash
  git --version  # Should show 2.28 or higher
  ```
- **Node.js**: Version 20+ (LTS recommended)
  ```bash
  node --version  # Should show v20.x.x or higher
  npm --version   # Should show 10.x.x or higher
  ```
- **Production Build**: Must pass without errors
  ```bash
  npm run build  # Should complete successfully
  ```

### Recommended
- **Code Editor**: VS Code, Sublime Text, or similar
- **Git Client**: GitHub Desktop, GitKraken, or CLI
- **Browser**: Chrome, Firefox, or Edge (for testing)

---

## Quick Start

For experienced users, here's the minimal deployment flow:

```bash
# 1. Configure your GitHub username
# Edit docusaurus.config.ts: Update 'url' and 'organizationName'

# 2. Create GitHub repository (public)
# Repository name: physical-ai-humanoid-robotics-book

# 3. Push to GitHub
git remote add origin https://github.com/YOURUSERNAME/physical-ai-humanoid-robotics-book.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages
# Go to: Settings → Pages → Source: GitHub Actions

# 5. Wait for deployment (2-5 minutes)
# Visit: https://YOURUSERNAME.github.io/physical-ai-humanoid-robotics-book/
```

---

## Detailed Setup

### Step 1: Create GitHub Repository

1. Navigate to https://github.com/new
2. Configure repository settings:
   - **Repository name**: `physical-ai-humanoid-robotics-book` (must match `baseUrl` in config)
   - **Description**: "Comprehensive online course on Physical AI and Humanoid Robotics"
   - **Visibility**: **Public** (required for free GitHub Pages)
   - **Initialize**: Do NOT check any boxes (README, .gitignore, license)
3. Click **Create repository**

**Important**: Repository name determines your site URL. If you use a different name, update `baseUrl` in `docusaurus.config.ts` accordingly.

### Step 2: Configure Deployment Settings

Update configuration files with your GitHub username:

#### `docusaurus.config.ts`

```typescript
// Line 11-13: Update GitHub organization and project details
url: 'https://salmansiddiqui-99.github.io',
baseUrl: '/rag-chatbot/',
organizationName: 'salmansiddiqui-99',
projectName: 'rag-chatbot',
```

#### `README.md`

```markdown
# Update the live URL (around line 15)
🔗 **Live Site**: https://salmansiddiqui-99.github.io/rag-chatbot/
```

**Verify Configuration**:
```bash
# Test build with updated config
npm run build

# Verify no path errors in console output
npm run serve
```

### Step 3: Initialize Git and Push to GitHub

If not already initialized:

```bash
# Initialize Git repository (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Docusaurus project setup"

# Set default branch name
git branch -M main

# Add GitHub remote (replace YOURUSERNAME)
git remote add origin https://github.com/YOURUSERNAME/physical-ai-humanoid-robotics-book.git

# Push code to GitHub
git push -u origin main
```

If you encounter authentication issues:

```bash
# Use GitHub CLI for authentication
gh auth login

# OR generate a Personal Access Token (PAT)
# Go to: GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
# Permissions: Read/Write access to code and workflows
```

### Step 4: Enable GitHub Pages

1. Navigate to your repository on GitHub: `https://github.com/YOURUSERNAME/physical-ai-humanoid-robotics-book`
2. Click **Settings** tab (top navigation)
3. Click **Pages** in the left sidebar (under "Code and automation")
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (not "Deploy from branch")
   - This enables the automated workflow in `.github/workflows/deploy.yml`
5. No other configuration needed - workflow is pre-configured

**Why GitHub Actions?**
- Zero-touch deployment (automatic on every push to `main`)
- Build logs for debugging
- Concurrent safety (prevents deployment conflicts)
- No manual deployment steps required

### Step 5: Monitor Deployment Workflow

1. Go to **Actions** tab in your repository
2. You should see a workflow run titled "Deploy to GitHub Pages"
3. Click on the workflow run to view detailed logs
4. Wait for both jobs to complete:
   - **Build**: Installs dependencies, builds site, uploads artifact (~2-3 minutes)
   - **Deploy**: Deploys artifact to GitHub Pages (~30-60 seconds)
5. Green checkmark = successful deployment ✅

**Expected Timeline**:
- First deployment: 3-5 minutes
- Subsequent deployments: 2-3 minutes (npm cache used)

### Step 6: Verify Live Site

1. Once workflow completes, visit: `https://YOURUSERNAME.github.io/physical-ai-humanoid-robotics-book/`
2. Verify homepage loads with correct title and content
3. Test navigation: Click through modules and sidebar links
4. Test search: Type a technical term (e.g., "ROS 2")
5. Test dark/light mode toggle (top-right corner)
6. Test mobile responsiveness: Open Chrome DevTools (F12) → Toggle device toolbar

**Initial Load**: First visit may take 5-10 seconds for DNS propagation. Refresh if you see a 404 error.

### Step 7: Create Release Tag (Optional)

Tag your deployment for version tracking:

```bash
# Tag the current commit
git tag -a v1.0.0 -m "Release v1.0.0: Initial launch of Physical AI book"

# Push tag to GitHub
git push origin v1.0.0

# Create a GitHub Release (via UI)
# Go to: Releases → Draft a new release → Choose tag v1.0.0 → Add changelog
```

**Semantic Versioning**:
- **v1.0.0**: Major launch
- **v1.1.0**: New module or feature
- **v1.0.1**: Bug fix or minor update

---

## Understanding the CI/CD Pipeline

### Workflow Overview

The `.github/workflows/deploy.yml` file automates deployment:

```yaml
on:
  push:
    branches: [main]  # Trigger on push to main branch
  workflow_dispatch:  # Allow manual trigger from Actions tab
```

**Workflow Structure**:

1. **Build Job**:
   - Checks out code (`actions/checkout@v4`)
   - Sets up Node.js 20 with npm cache (`actions/setup-node@v4`)
   - Installs dependencies (`npm ci` - faster than `npm install`)
   - Builds Docusaurus site (`npm run build`)
   - Uploads `./build` directory as artifact (`actions/upload-pages-artifact@v3`)

2. **Deploy Job** (depends on Build success):
   - Deploys artifact to GitHub Pages (`actions/deploy-pages@v4`)
   - Sets environment URL (accessible in workflow output)

### Permissions

```yaml
permissions:
  contents: read     # Read repository code
  pages: write       # Write to GitHub Pages
  id-token: write    # OIDC token for deployment
```

### Concurrency Control

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false  # Wait for current deployment to finish
```

This prevents deployment conflicts if multiple commits are pushed rapidly.

---

## Deployment Verification

### Automated Checks

After deployment, verify the following:

#### 1. Homepage Loads

```bash
curl -I https://YOURUSERNAME.github.io/physical-ai-humanoid-robotics-book/
# Expected: HTTP/2 200 (not 404)
```

#### 2. Navigation Works

- Click all sidebar links
- Verify no 404 errors
- Check breadcrumb navigation

#### 3. Assets Load

- Images display correctly
- Code syntax highlighting works
- CSS styles applied

#### 4. Search Functionality

- Type query in search box
- Verify results appear
- Click result, verify navigation

### Performance Testing

#### Google Lighthouse Audit

1. Open live site in Chrome
2. Press F12 → Lighthouse tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"

**Target Scores**:
- Performance: 90+ (✅ SC-003: <2s page load)
- Accessibility: 90+ (✅ SC-004: WCAG compliance)
- Best Practices: 90+
- SEO: 90+

#### WebPageTest

1. Go to https://www.webpagetest.org/
2. Enter your site URL
3. Select location (e.g., "Dulles, VA - Chrome")
4. Click "Start Test"

**Key Metrics**:
- First Contentful Paint (FCP): <1.8s
- Time to Interactive (TTI): <3.8s
- Total Blocking Time (TBT): <200ms

### Accessibility Testing

#### WAVE Tool

1. Go to https://wave.webaim.org/
2. Enter your site URL
3. Review errors, alerts, and contrast issues

**Target**: Zero errors (✅ SC-004)

#### Keyboard Navigation

- Tab through all links (focus indicators visible)
- Press Enter to activate links
- Press Escape to close modals

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Fails in GitHub Actions

**Symptom**: Red X on workflow run, error in build logs

**Diagnosis**:
```bash
# Test build locally
npm run build

# Check for errors in terminal output
```

**Common Causes**:
- Missing dependencies in `package.json`
- TypeScript errors in `.ts` or `.tsx` files
- Broken MDX syntax in content files
- Missing images referenced in markdown

**Solution**:
```bash
# Fix errors locally first
npm run build  # Fix all errors

# Verify production build works
npm run serve

# Then commit and push
git add .
git commit -m "Fix build errors"
git push origin main
```

#### 2. 404 Error After Deployment

**Symptom**: Page not found when visiting site URL

**Diagnosis**:
1. Check GitHub Pages settings: Settings → Pages → Source should be "GitHub Actions"
2. Verify workflow completed successfully (green checkmark in Actions tab)
3. Check `baseUrl` in `docusaurus.config.ts` matches repository name

**Common Causes**:
- GitHub Pages not enabled
- Wrong `baseUrl` configuration
- DNS propagation delay (wait 5-10 minutes)

**Solution**:
```typescript
// docusaurus.config.ts - Verify these match
baseUrl: '/physical-ai-humanoid-robotics-book/',  // Must match repo name
url: 'https://YOURUSERNAME.github.io',
```

#### 3. Broken Links on Deployed Site

**Symptom**: Internal links return 404 errors

**Diagnosis**:
```bash
# Run Docusaurus link checker
npm run build  # Docusaurus warns about broken links

# Install dedicated link checker
npm install -g broken-link-checker

# Check live site
blc https://YOURUSERNAME.github.io/physical-ai-humanoid-robotics-book/ -ro
```

**Common Causes**:
- Incorrect relative paths in markdown (`./file.md` vs `../file.md`)
- Case sensitivity (`Module-1` vs `module-1`)
- Missing files in `docs/` directory

**Solution**:
- Fix links in MDX files
- Use Docusaurus auto-generated sidebar links
- Test locally with `npm run serve` before deploying

#### 4. Styles Not Applied

**Symptom**: Site looks broken, missing colors/fonts

**Diagnosis**:
- Check browser console (F12) for CSS errors
- Verify `src/css/custom.css` exists
- Check `docusaurus.config.ts` includes custom CSS

**Solution**:
```bash
# Clear browser cache (Ctrl+Shift+R)
# Rebuild site
npm run build
npm run serve

# Verify styles in local build first
```

#### 5. Search Not Working

**Symptom**: Search box appears but returns no results

**Diagnosis**:
- Check if search plugin installed: `npm list @easyops-cn/docusaurus-search-local`
- Verify plugin configured in `docusaurus.config.ts`

**Solution**:
```bash
# Reinstall search plugin
npm install @easyops-cn/docusaurus-search-local

# Rebuild search index
npm run build

# Test locally
npm run serve
```

#### 6. Workflow Fails with "Permission denied"

**Symptom**: Deploy step fails with authentication error

**Diagnosis**:
- Check repository Settings → Actions → General → Workflow permissions
- Should be "Read and write permissions"

**Solution**:
1. Go to Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Click "Save"
5. Re-run workflow from Actions tab

---

## Advanced Configuration

### Custom Domain Setup

#### Step 1: Purchase Domain

Register a domain from:
- Namecheap (https://www.namecheap.com/)
- Google Domains (https://domains.google/)
- Cloudflare Registrar (https://www.cloudflare.com/products/registrar/)

#### Step 2: Add CNAME File

Create `static/CNAME` (no file extension):

```text
physicalai.dev
```

#### Step 3: Configure DNS Records

Add these DNS records with your domain provider:

**For apex domain (physicalai.dev)**:
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**For www subdomain (www.physicalai.dev)**:
```
Type: CNAME
Name: www
Value: YOURUSERNAME.github.io
```

#### Step 4: Update Docusaurus Config

```typescript
// docusaurus.config.ts
url: 'https://physicalai.dev',  // Your custom domain
baseUrl: '/',  // Root path (not /repo-name/)
```

#### Step 5: Enable HTTPS

1. Wait 24-48 hours for DNS propagation
2. Go to Settings → Pages
3. Check "Enforce HTTPS" (appears after DNS propagates)

### Multiple Environments

Deploy to staging and production:

#### Staging Environment

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # ... (same as deploy.yml)
      - name: Deploy to Vercel Staging
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

#### Production Environment

Use existing `deploy.yml` for main branch.

### Environment Variables

For dynamic configuration:

```typescript
// docusaurus.config.ts
const isProduction = process.env.NODE_ENV === 'production';

export default {
  url: isProduction ? 'https://physicalai.dev' : 'http://localhost:3000',
  // ...
};
```

---

## Performance Optimization

### 1. Image Optimization

Compress images before committing:

```bash
# Install ImageOptim CLI (macOS)
brew install imageoptim-cli

# Optimize all images
imageoptim static/img/**/*

# OR use TinyPNG online: https://tinypng.com/
```

**Target**: <200KB per image

### 2. Code Splitting

Docusaurus automatically splits code, but you can optimize further:

```typescript
// docusaurus.config.ts
export default {
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
};
```

### 3. Lazy Loading Images

```mdx
<!-- Use native lazy loading -->
![ROS 2 Architecture](./img/ros2-arch.png){loading="lazy"}
```

### 4. Minification

Already enabled by default in production builds (`npm run build`).

### 5. Caching Strategy

GitHub Pages automatically caches static assets. For custom control:

```yaml
# .github/workflows/deploy.yml
- name: Build website
  run: |
    npm run build
    # Add cache headers to build/index.html
    echo "Cache-Control: max-age=3600" > build/.htaccess
```

---

## Security Best Practices

### 1. Secrets Management

Never commit secrets to Git:

```bash
# Add to .gitignore
echo ".env.local" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
```

Use GitHub Secrets for sensitive data:
- Settings → Secrets and variables → Actions → New repository secret

### 2. Dependabot

Enable Dependabot for automatic dependency updates:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 3. HTTPS Enforcement

Always enforce HTTPS:
- Settings → Pages → Enforce HTTPS ✅

### 4. Content Security Policy

Add CSP headers via `docusaurus.config.ts`:

```typescript
export default {
  scripts: [
    {
      src: 'https://example.com/script.js',
      integrity: 'sha384-...', // Subresource Integrity
      crossorigin: 'anonymous',
    },
  ],
};
```

---

## Continuous Deployment

### Automated Workflow

Every push to `main` triggers automatic deployment:

```bash
# Make content changes
vim docs/module-1-ros2/architecture.mdx

# Commit and push
git add docs/module-1-ros2/architecture.mdx
git commit -m "Update ROS 2 architecture content"
git push origin main

# Deployment starts automatically (2-3 minutes)
```

### Manual Deployment

Trigger deployment manually from Actions tab:

1. Go to Actions → Deploy to GitHub Pages
2. Click "Run workflow" dropdown
3. Select branch (`main`)
4. Click "Run workflow" button

### Deployment Notifications

Get notified on deployment status:

1. Go to Settings → Notifications
2. Enable "Actions" notifications
3. Choose "Email" or "Web" notifications

---

## Monitoring and Analytics

### GitHub Pages Traffic

View basic analytics:
- Insights → Traffic → Views and Clones

### Google Analytics (Optional)

Add Google Analytics to `docusaurus.config.ts`:

```typescript
export default {
  themeConfig: {
    gtag: {
      trackingID: 'G-XXXXXXXXXX',  // Your GA4 tracking ID
      anonymizeIP: true,
    },
  },
};
```

### Uptime Monitoring

Use free services:
- UptimeRobot (https://uptimerobot.com/)
- Pingdom (https://www.pingdom.com/)
- StatusCake (https://www.statuscake.com/)

---

## Support and Resources

### Official Documentation

- **Docusaurus Deployment**: https://docusaurus.io/docs/deployment
- **GitHub Pages**: https://docs.github.com/en/pages
- **GitHub Actions**: https://docs.github.com/en/actions

### Community Support

- **Docusaurus Discord**: https://discord.gg/docusaurus
- **GitHub Discussions**: Repository → Discussions tab
- **Stack Overflow**: Tag `docusaurus` or `github-pages`

### Helpful Commands

```bash
# Check deployment logs
gh run list --workflow=deploy.yml
gh run view <run-id> --log

# Test production build locally
npm run build && npm run serve

# Validate links
npm run build | grep -i "broken"

# Check bundle size
npm run build && du -sh build/
```

---

## Checklist: Pre-Deployment

Before pushing to production, verify:

- [ ] All content reviewed and proofread
- [ ] `npm run build` completes without errors
- [ ] `npm run serve` shows correct content locally
- [ ] Images optimized (<200KB each)
- [ ] All links tested (no 404 errors)
- [ ] Lighthouse audit passes (90+ all categories)
- [ ] WAVE accessibility check passes (zero errors)
- [ ] Mobile responsiveness tested (320px-2560px)
- [ ] Dark/light mode toggle works
- [ ] Search returns relevant results
- [ ] GitHub repository is public
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] `url` and `organizationName` updated in config
- [ ] Git remote configured correctly
- [ ] Release tag created (e.g., v1.0.0)

---

## Post-Deployment Tasks

After successful deployment:

1. ✅ Share live URL with stakeholders
2. ✅ Submit sitemap to Google Search Console
3. ✅ Enable Google Analytics (if desired)
4. ✅ Set up uptime monitoring
5. ✅ Create GitHub Release with changelog
6. ✅ Update README.md with live URL
7. ✅ Archive specification documents
8. ✅ Celebrate launch! 🎉

---

**Last Updated**: 2025-12-24
**Docusaurus Version**: 3.x
**Node.js Version**: 20+
**Deployment Method**: GitHub Actions → GitHub Pages
