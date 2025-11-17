# Digital Signage Feature Implementation

## Overview

The Digital Signage feature is a fullscreen slideshow component designed for FireTV displays and large screens. It automatically displays images from a Google Drive folder in a continuous loop, with automatic daily updates to pick up new or removed images.

## Features

- ✅ **Fullscreen Slideshow**: TV-optimized display without header, footer, or age verification
- ✅ **Automatic Transitions**: Configurable slide duration with smooth transitions
- ✅ **Google Drive Integration**: Dynamically fetches images from a shared Google Drive folder
- ✅ **Auto-Refresh**: Automatically refreshes image list daily (configurable)
- ✅ **Rate Limiting Protection**: Built-in throttling to prevent 429 errors from Google CDN
- ✅ **Error Handling**: Graceful error handling with retry logic
- ✅ **Responsive Design**: Optimized for large displays and FireTV

## Architecture

### Components

1. **Signage.js** (`src/components/Signage.js`)
   - Main React component that manages the slideshow
   - Handles image fetching, state management, and rendering
   - Implements throttling and error retry logic

2. **generateSignageImagesGoogleDrive.js** (`scripts/generateSignageImagesGoogleDrive.js`)
   - Node.js script to fetch images from Google Drive API
   - Generates JSON file with image URLs
   - Used by GitHub Actions for daily updates

3. **GitHub Actions Workflows**
   - `update-signage.yml`: Daily update workflow
   - `deploy.yml`: Deployment workflow

### Data Flow

```
Google Drive Folder
    ↓
Google Drive API (via script)
    ↓
public/api/signage-images.json
    ↓
Signage Component (fetches JSON)
    ↓
Display Images in Slideshow
```

## Setup Instructions

### Prerequisites

- Node.js 20+ installed
- Google Drive account with images folder
- Google Cloud Console project with Drive API enabled

### Step 1: Google Drive Setup

1. **Create a Google Drive folder** and upload your images
2. **Share the folder publicly**:
   - Right-click folder → **Share** → **Anyone with the link can view**
3. **Get the folder ID**:
   - Open folder in browser
   - Copy folder ID from URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
4. **Share each image file individually** (for direct CDN access):
   - Right-click each image → **Share** → **Anyone with the link can view**

### Step 2: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google Drive API:
   - Go to **APIs & Services** → **Library**
   - Search "Google Drive API"
   - Click **Enable**
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the API key
   - (Optional) Restrict key to **Google Drive API** for security

### Step 3: Generate Image List

#### Local Testing

```bash
npm run generate-signage-images-gdrive "FOLDER_ID" public/api/signage-images.json "API_KEY"
```

#### Verify Output

Check `public/api/signage-images.json`:
```json
[
  "https://lh3.googleusercontent.com/drive-storage/...",
  "https://lh3.googleusercontent.com/drive-storage/...",
  ...
]
```

### Step 4: Configure Environment Variables

Create or update `.env` file:

```env
# Required: Path to JSON file with image URLs
REACT_APP_IMAGE_SOURCE=/api/signage-images.json

# Optional: Slide duration in milliseconds (default: 10000 = 10 seconds)
REACT_APP_SIGNAGE_SLIDE_DURATION=10000

# Optional: Auto-refresh interval in milliseconds (default: 86400000 = 24 hours)
REACT_APP_SIGNAGE_REFRESH_INTERVAL=86400000
```

### Step 5: Test Locally

```bash
npm start
```

Visit: `http://localhost:3000/signage`

### Step 6: GitHub Actions Setup (Production)

1. **Add GitHub Secrets**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add `GOOGLE_DRIVE_FOLDER_ID`
   - Add `GOOGLE_DRIVE_API_KEY`
   - (Optional) Add `REACT_APP_SIGNAGE_SLIDE_DURATION`
   - (Optional) Add `REACT_APP_SIGNAGE_REFRESH_INTERVAL`

2. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Source: **GitHub Actions**

3. **Deploy**:
   ```bash
   git push origin master
   ```

## Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_IMAGE_SOURCE` | Path to JSON file with image URLs | - | Yes |
| `REACT_APP_SIGNAGE_SLIDE_DURATION` | Duration per slide (ms) | `10000` | No |
| `REACT_APP_SIGNAGE_REFRESH_INTERVAL` | Auto-refresh interval (ms) | `86400000` | No |

### JSON File Format

The `signage-images.json` file should be an array of image URLs:

```json
[
  "https://lh3.googleusercontent.com/drive-storage/...",
  "https://lh3.googleusercontent.com/drive-storage/...",
  "https://lh3.googleusercontent.com/drive-storage/..."
]
```

Or with an `images` property:

```json
{
  "images": [
    "https://lh3.googleusercontent.com/drive-storage/...",
    "https://lh3.googleusercontent.com/drive-storage/...",
    "https://lh3.googleusercontent.com/drive-storage/..."
  ]
}
```

## Usage

### Accessing the Signage

Navigate to `/signage` path:
- Local: `http://localhost:3000/signage`
- Production: `https://yourdomain.com/signage`

### Manual Image Update

**From GitHub UI:**
1. Go to **Actions** tab
2. Select **Update Signage Images** workflow
3. Click **Run workflow**
4. Select branch and run

**From Command Line:**
```bash
gh workflow run update-signage.yml --ref master
```

### Updating Images in Google Drive

1. Add or remove images from your Google Drive folder
2. Ensure new images are publicly shared
3. Manually trigger the update workflow, or wait for daily update (2 AM UTC)

## Technical Details

### Image Loading Strategy

The component uses a throttled loading approach to prevent 429 errors:

1. **Throttling**: Minimum 5-second delay between image loads
2. **Active Loading**: Only loads the currently active slide
3. **Retry Logic**: Exponential backoff retry (up to 3 attempts)
4. **Browser Caching**: Leverages browser cache for repeated requests

### Component Architecture

```javascript
Signage Component
├── State Management
│   ├── images: Array of image URLs
│   ├── currentIndex: Current slide index
│   ├── loading: Loading state
│   ├── error: Error state
│   └── lastImageLoadTime: Throttling timestamp
├── useEffect Hooks
│   ├── Initial fetch and auto-refresh
│   └── Slide transition interval
└── ActiveImageWithThrottle Component
    ├── Throttled image loading
    ├── Error handling with retries
    └── Image display
```

### Rate Limiting Protection

To prevent 429 "Too Many Requests" errors from Google CDN:

- **Throttling**: 5-second minimum delay between image loads
- **Slide Duration**: Default 10 seconds (configurable)
- **Active Loading Only**: Only loads the currently visible image
- **Exponential Backoff**: Retry with increasing delays on errors

### Error Handling

- **Fetch Errors**: Displays error message with details
- **Image Load Errors**: Retries up to 3 times with exponential backoff
- **Network Errors**: Graceful degradation with user-friendly messages

## Workflow Automation

### Daily Update Workflow

**Schedule**: Daily at 2 AM UTC (configurable)

**Actions**:
1. Checks out repository
2. Installs dependencies
3. Generates new image list from Google Drive
4. Commits changes if images changed
5. Triggers automatic redeployment

**Configuration**: `.github/workflows/update-signage.yml`

**Customize Schedule**:
```yaml
schedule:
  - cron: '0 2 * * *'  # 2 AM UTC daily
```

Use [crontab.guru](https://crontab.guru/) to calculate your desired schedule.

### Deployment Workflow

**Triggers**: Push to `master` branch, tags, or manual

**Actions**:
1. Builds React application
2. Generates image lists
3. Deploys to GitHub Pages

**Configuration**: `.github/workflows/deploy.yml`

## Troubleshooting

### Images Not Loading

**Issue**: Images don't appear in slideshow

**Solutions**:
1. Verify `public/api/signage-images.json` exists and has valid URLs
2. Check JSON format (should be array of strings)
3. Ensure Google Drive folder is publicly shared
4. Verify each image file is publicly shared
5. Check browser console for errors

### 429 Rate Limiting Errors

**Issue**: Getting "Too Many Requests" errors

**Solutions**:
1. Increase `REACT_APP_SIGNAGE_SLIDE_DURATION` (e.g., `15000` for 15 seconds)
2. The component already has 5-second throttling built-in
3. Ensure only one instance of the slideshow is running

### Images Not Updating

**Issue**: Changes in Google Drive don't appear on site

**Solutions**:
1. Manually trigger **Update Signage Images** workflow
2. Verify GitHub secrets are set correctly
3. Check workflow logs in **Actions** tab
4. Ensure new images are publicly shared

### Build Errors

**Issue**: Build fails during deployment

**Solutions**:
1. Check GitHub Actions logs for specific errors
2. Verify environment variables are set in workflow
3. Ensure JSON file exists and is valid
4. Check for ESLint errors (run `npm run build` locally)

### Blank Screen

**Issue**: Signage page shows blank screen

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify `REACT_APP_IMAGE_SOURCE` is set correctly
3. Ensure JSON file is accessible at the path
4. Check network tab for failed requests

## Best Practices

### Image Optimization

- Use compressed images (JPEG or WebP)
- Recommended resolution: 1920x1080 or higher for signage
- Keep file sizes reasonable (< 5MB per image)

### Folder Organization

- Keep all signage images in a single folder
- Use descriptive filenames
- Remove old/unused images from folder

### Security

- Restrict Google Drive API key to Drive API only
- Keep API key in GitHub Secrets (never commit)
- Use environment variables for all sensitive data

### Performance

- Limit total number of images (recommended: < 50)
- Use appropriate slide duration (10-15 seconds)
- Test on actual display device before deployment

## API Reference

### Component Props

The `Signage` component doesn't accept props. All configuration is done via environment variables.

### Script Usage

```bash
npm run generate-signage-images-gdrive <FOLDER_ID> <OUTPUT_PATH> <API_KEY>
```

**Parameters**:
- `FOLDER_ID`: Google Drive folder ID
- `OUTPUT_PATH`: Path to output JSON file (e.g., `public/api/signage-images.json`)
- `API_KEY`: Google Drive API key

**Example**:
```bash
npm run generate-signage-images-gdrive "1ABC123..." "public/api/signage-images.json" "AIza..."
```

## File Structure

```
holly_valley_website/
├── src/
│   └── components/
│       ├── Signage.js          # Main signage component
│       └── Signage.css         # Signage styles
├── scripts/
│   └── generateSignageImagesGoogleDrive.js  # Image generation script
├── public/
│   └── api/
│       └── signage-images.json # Generated image list (gitignored in .env)
└── .github/
    └── workflows/
        ├── update-signage.yml  # Daily update workflow
        └── deploy.yml          # Deployment workflow
```

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for video files
- [ ] Transition effects (fade, slide, etc.)
- [ ] Remote control API for manual slide navigation
- [ ] Image preloading for smoother transitions
- [ ] Multiple slideshow modes (shuffle, reverse, etc.)
- [ ] Analytics integration for view tracking
- [ ] Support for multiple image sources

## Support

For issues or questions:
1. Check this documentation first
2. Review GitHub Actions logs
3. Check browser console for errors
4. Verify all configuration steps were followed

## Changelog

### Version 1.0 (Current)
- Initial implementation with Google Drive integration
- Automatic daily updates via GitHub Actions
- Rate limiting protection
- Fullscreen slideshow with configurable timing

