# Holly Valley Website - GitHub Pages Deployment

This guide explains how to deploy the Holly Valley website to GitHub Pages.

## 🚀 Quick Deployment

### Option 1: Manual Deployment
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Option 2: Automatic Deployment (Recommended)
The project is configured with GitHub Actions for automatic deployment.

1. **Push to main or react-dev branch**
2. **GitHub Actions will automatically:**
   - Install dependencies
   - Generate image list
   - Build the project
   - Deploy to GitHub Pages

## 📋 Prerequisites

1. **GitHub Pages enabled** in your repository settings
2. **gh-pages branch** will be created automatically
3. **GitHub Actions** enabled in your repository

## ⚙️ GitHub Pages Setup

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Set **Source** to "Deploy from a branch"
4. Set **Branch** to "gh-pages" and folder to "/ (root)"
5. Click **Save**

## 🔧 Configuration Files

- **package.json**: Contains homepage URL and deployment scripts
- **.github/workflows/deploy.yml**: GitHub Actions workflow
- **public/.nojekyll**: Tells GitHub Pages not to use Jekyll
- **public/404.html**: Handles routing for single-page app
- **public/index.html**: Contains routing script for GitHub Pages

## 🌐 Custom Domain Configuration

The site is configured with the custom domain `wilkes-cstore.com`:

1. ✅ Domain added to the `cname` field in `.github/workflows/deploy.yml`
2. ✅ `CNAME` file created in the `public/` folder with `wilkes-cstore.com`
3. ⚠️ **DNS Configuration Required**: Configure DNS settings with your domain provider

### DNS Configuration for wilkes-cstore.com

#### For GitHub Pages:
1. **A Records** (if using apex domain):
   - Type: `A`
   - Name: `@` (or leave blank)
   - Value: `185.199.108.153`
   - Value: `185.199.109.153`
   - Value: `185.199.110.153`
   - Value: `185.199.111.153`

2. **CNAME Record** (recommended):
   - Type: `CNAME`
   - Name: `@` (or `wilkes-cstore.com`)
   - Value: `harshbpatel97.github.io`

#### For BizClass Hosting:
1. **Point your domain to BizClass nameservers** (if using BizClass DNS)
2. **Create a CNAME record** pointing to your GitHub Pages site:
   - Type: `CNAME`
   - Name: `@` (or `wilkes-cstore.com`)
   - Value: `harshbpatel97.github.io`

#### Alternative: Use GitHub Pages as CDN
If you want to use BizClass hosting as primary and GitHub Pages as a CDN:
1. Set up your main site on BizClass hosting
2. Create a subdomain like `cdn.wilkes-cstore.com` pointing to GitHub Pages
3. Update the GitHub Actions workflow to use the subdomain

## 📱 Features

- ✅ **Automatic deployment** on push to main/react-dev
- ✅ **Client-side routing** support
- ✅ **Image optimization** and dynamic loading
- ✅ **Mobile responsive** design
- ✅ **SEO optimized** with proper meta tags

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Routing Issues
- Ensure `.nojekyll` file is in the `public/` folder
- Check that `404.html` and routing scripts are present
- Verify GitHub Pages is set to serve from `gh-pages` branch

### Image Loading Issues
```bash
# Regenerate image list
npm run generate-images

# Rebuild and deploy
npm run build && npm run deploy
```

## 📞 Support

For deployment issues, check:
1. GitHub Actions logs in your repository
2. GitHub Pages settings
3. Build output in the Actions tab

The website will be available at: https://wilkes-cstore.com 