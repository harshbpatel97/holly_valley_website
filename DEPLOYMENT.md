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

## 🌐 Custom Domain (Optional)

If you have a custom domain (e.g., hollyvalley.com):

1. Add your domain to the `cname` field in `.github/workflows/deploy.yml`
2. Create a `CNAME` file in the `public/` folder with your domain
3. Configure DNS settings with your domain provider

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

The website will be available at: https://harshbpatel97.github.io/holly_valley_website 