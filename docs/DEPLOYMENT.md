# Deployment Guide

Complete guide for deploying the Holly Valley website to GitHub Pages with automatic updates.

## Quick Start

### 1. Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
3. Click **Save**

### 2. Add Required Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Required for Signage:**
- `GOOGLE_DRIVE_FOLDER_ID` - Your Google Drive folder ID from the URL
- `GOOGLE_DRIVE_API_KEY` - Your Google Drive API key
- `REACT_APP_SIGNAGE_TOKEN` - Secret token for accessing the signage page (e.g., `your-secret-token-123`)

**Optional:**
- `REACT_APP_GA_ID` - Google Analytics tracking ID (e.g., `G-XXXXXXXXXX`)
- `REACT_APP_SIGNAGE_SLIDE_DURATION` - Slide duration in milliseconds (default: `10000`)
- `REACT_APP_SIGNAGE_REFRESH_INTERVAL` - Refresh interval in milliseconds (default: `86400000`)

### 3. Deploy

```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

Go to **Actions** tab to watch the deployment. It will take 2-5 minutes.

## How It Works

### Automatic Deployment

Every push to `master` branch automatically:
1. Builds the React app
2. Generates image lists
3. Deploys to GitHub Pages

**Workflow:** `.github/workflows/deploy.yml`

### Automatic Signage Updates

Every day at 2 AM UTC:
1. Fetches images from Google Drive
2. Updates `public/api/signage-images.json`
3. Commits changes (if any)
4. Triggers automatic redeployment

**Workflow:** `.github/workflows/update-signage.yml`

You can also trigger manually:
- Go to **Actions** → **Update Signage Images** → **Run workflow**

## GitHub Secrets Setup

### Getting Google Drive Folder ID

1. Upload images to a Google Drive folder
2. Right-click folder → **Share** → **Anyone with the link can view**
3. Open folder in browser
4. Copy folder ID from URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID_HERE
   ```
   The `FOLDER_ID_HERE` is what you need

### Getting Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Drive API**:
   - Go to **APIs & Services** → **Library**
   - Search "Google Drive API"
   - Click **Enable**
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the API key
   - (Optional) Click on the key → **Restrict key** → **Google Drive API** → **Save**

### Adding Secrets to GitHub

1. Go to your repository on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_DRIVE_FOLDER_ID`
5. Value: Your folder ID
6. Click **Add secret**
7. Repeat for `GOOGLE_DRIVE_API_KEY`
8. Repeat for `REACT_APP_SIGNAGE_TOKEN` (create a strong, random token for security)

## Testing Before Deploy

### Test Locally

```bash
# Generate signage images JSON
npm run generate-signage-images-gdrive "FOLDER_ID" public/api/signage-images.json "API_KEY"

# Verify JSON file was created
cat public/api/signage-images.json

# Test build
npm run build

# Test local server (uses build folder)
npx serve -s build
```

### Test Deployment Workflow

1. Make a small change (e.g., update README)
2. Commit and push to `master`
3. Go to **Actions** tab
4. Watch **Deploy to GitHub Pages** workflow
5. Verify it completes successfully ✅

## Custom Domain Setup

Your site already has a custom domain (`wilkes-cstore.com`) configured via `public/CNAME`.

**To update or change domain:**
1. Edit `public/CNAME` file
2. Update DNS records with your domain provider:
   - Type: `CNAME`
   - Name: `@` or your subdomain
   - Value: `YOUR_USERNAME.github.io`
3. In GitHub Pages settings:
   - Enter custom domain
   - Enable **Enforce HTTPS**

## Monitoring

### Check Deployment Status

- **Actions** tab → **Deploy to GitHub Pages** workflow
- Green checkmark ✅ = Success
- Red X ❌ = Failed (click to see logs)

### Check Signage Updates

- **Actions** tab → **Update Signage Images** workflow
- Check if it runs daily
- Manually trigger to test

### Verify Site

- Visit your site URL
- Test `/signage` path
- Check browser console for errors

## Troubleshooting

### Deployment Fails

**Error: "Build failed"**
- Check Actions logs for specific error
- Verify Node.js version is 20 (set in workflow)
- Test build locally: `npm run build`

**Error: "Permission denied"**
- Verify GitHub Pages is enabled with **GitHub Actions** source
- Check repository permissions

**Error: "Missing secrets"**
- Verify all required secrets are set
- Check secret names match exactly (case-sensitive)

### Signage Not Working

**Images don't load:**
1. Verify `public/api/signage-images.json` exists in repository
2. Check JSON format (should be array: `["url1", "url2"]`)
3. Verify Google Drive folder is publicly shared
4. Test API key: Run generation script locally

**Images not updating:**
1. Check **Update Signage Images** workflow in Actions
2. Verify it's running (check schedule or trigger manually)
3. Check workflow logs for errors
4. Verify secrets are set correctly

**429 Errors (rate limiting):**
- Increase `REACT_APP_SIGNAGE_SLIDE_DURATION` secret (e.g., `15000` for 15 seconds)
- This is handled automatically in production

### Site Not Updating

- **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Wait 1-5 minutes** for GitHub Pages to update
- **Check Actions tab** - deployment may still be running
- **Verify branch:** Ensure you pushed to `master` branch

## Schedule Customization

To change the daily update time, edit `.github/workflows/update-signage.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # 2 AM UTC daily
```

Use [crontab.guru](https://crontab.guru/) to calculate your desired schedule:
- `0 2 * * *` = 2 AM UTC daily
- `0 9 * * *` = 9 AM UTC daily
- `0 */6 * * *` = Every 6 hours

## Production Checklist

Before going live:

- [ ] All secrets configured in GitHub
- [ ] GitHub Pages enabled with Actions source
- [ ] Test deployment succeeds
- [ ] Signage JSON file generates correctly
- [ ] Test `/signage` path works
- [ ] Custom domain configured (if using)
- [ ] Monitor first few deployments
- [ ] Verify daily update workflow runs

## Support

For deployment issues:
1. Check **Actions** tab for error logs
2. Verify all secrets are set correctly
3. Test scripts locally first
4. Review workflow files in `.github/workflows/`
