# Holly Valley React Website

This is a React conversion of the original Holly Valley static HTML website. The React version maintains all the original functionality while providing a modern, component-based architecture.

## Features

- **Age Verification**: Age verification modal that appears on first visit
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Dark Mode**: Full dark mode support with toggle button and URL parameter control
- **Image Slider**: Automatic image carousel on the home page
- **Accordion Sections**: Collapsible sections for services and products
- **Image Zoom**: Click to zoom functionality for product images
- **Navigation**: Dropdown navigation with active state indicators
- **Routing**: Client-side routing between pages
- **Dynamic Image Management**: Easy-to-manage image systems for store and product images

## Pages

- **Home**: Welcome page with image slider, about us, address, and hours
- **Services**: ATM, payment methods, U-Haul services, and NC Lottery information
- **Products**: Groceries and soft drinks with image galleries
- **Contact**: Contact information and location details
- **Signage** (`/signage`): Digital signage slideshow for FireTV displays (bypasses header, footer, and age verification)

## Dark Mode / Theme Control

The website supports full dark mode with multiple ways to control the theme:

### Toggle Button

- A dark mode toggle button is available in the header (top right)
- Click the moon icon to switch to dark mode, or the sun icon to switch to light mode
- Your preference is saved and persists across page reloads

### URL Parameter Control

You can control the theme via URL parameters, which is useful for:
- Bookmarks with a specific theme
- Sharing links with a preferred theme
- Forcing a theme for specific pages or presentations

**Supported URL Parameters:**
- `?theme=dark` - Switch to dark mode
- `?theme=light` - Switch to light mode
- `?mode=dark` - Alternative parameter for dark mode
- `?mode=light` - Alternative parameter for light mode

**Examples:**
- `https://yourdomain.com/?theme=dark` - Home page in dark mode
- `https://yourdomain.com/services?mode=light` - Services page in light mode
- `https://yourdomain.com/signage?token=xxx&theme=dark` - Signage page in dark mode

**Notes:**
- URL parameters take precedence over saved preferences
- The theme persists when navigating between pages
- Works across all pages on the website
- URL parameters update localStorage to maintain consistency

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

### Environment Variables

Create a `.env` file in the root directory to configure environment variables:

```env
# Google Analytics ID (optional)
REACT_APP_GA_ID=

# Google Drive API Key (required for all image features)
# Get your API key from: https://console.cloud.google.com/
# Enable "Drive API" and create an API key
REACT_APP_GOOGLE_DRIVE_API_KEY=your-api-key-here

# Google Drive Master Folder (Recommended - Simplest Setup)
# Create one master folder with subfolders for each category
# Get master folder ID from URL: https://drive.google.com/drive/folders/FOLDER_ID
REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID=your-master-folder-id

# Optional: Individual Folder IDs (Alternative to master folder)
# If not using master folder, you can set individual folder IDs for each category:
# REACT_APP_STORE_IMAGES_FOLDER_ID=your-store-images-folder-id
# REACT_APP_GROCERIES_FOLDER_ID=your-groceries-folder-id
# REACT_APP_SOFT_DRINKS_FOLDER_ID=your-soft-drinks-folder-id
# REACT_APP_ICE_BAGS_FOLDER_ID=your-ice-bags-folder-id
# REACT_APP_FROZEN_PIZZA_FOLDER_ID=your-frozen-pizza-folder-id
# REACT_APP_FIREWOOD_FOLDER_ID=your-firewood-folder-id
# REACT_APP_ICE_CREAM_FOLDER_ID=your-ice-cream-folder-id

# Digital Signage Configuration
REACT_APP_SIGNAGE_SLIDE_DURATION_MS=10000
REACT_APP_GOOGLE_DRIVE_FETCH_INTERVAL_DAYS=7
REACT_APP_SIGNAGE_TOKEN=your-secret-token-here

# Optional: Proxy URLs (alternative to folder IDs)
# If you prefer using proxy endpoints instead of direct folder IDs:
# REACT_APP_STORE_IMAGES_PROXY_URL=/api/googledrive/images?folderId=FOLDER_ID
# REACT_APP_GROCERIES_PROXY_URL=/api/googledrive/images?folderId=FOLDER_ID
# (similar pattern for other categories)
```

**Note**: Make sure to add `.env` to `.gitignore` to protect sensitive information.

## Project Structure

```
src/
├── components/
│   ├── AgeVerification.js      # Age verification modal
│   ├── AgeVerification.css
│   ├── Header.js               # Navigation header
│   ├── Header.css
│   ├── Footer.js               # Site footer
│   ├── Footer.css
│   ├── Home.js                 # Home page component
│   ├── Home.css
│   ├── Services.js             # Services page component
│   ├── Services.css
│   ├── Products.js             # Products page component
│   ├── Products.css
│   ├── Contact.js              # Contact page component
│   ├── Contact.css
│   ├── Signage.js              # Digital signage slideshow for FireTV
│   └── Signage.css
├── config/
│   ├── storeImages.js          # Store images configuration (Google Drive)
│   └── productImages.js        # Product images configuration (Google Drive)
├── utils/
│   ├── googleDriveImages.js    # Google Drive image fetching utilities
│   ├── imageUtils.js           # Image utility functions
│   └── ga.js                   # Google Analytics utilities
├── App.js                      # Main app component with routing
├── App.css                     # Global styles
└── index.js                    # App entry point
scripts/
├── generateAllImagesFromGoogleDrive.js  # Generate all image lists from Google Drive
├── generateSignageImagesGoogleDrive.js  # Generate signage images from Google Drive
└── verifyGoogleDriveSharing.js          # Verify Google Drive folder sharing
public/
├── api/                        # Generated image JSON files (optional)
│   ├── store-images.json
│   ├── groceries-images.json
│   └── ...
└── images/                     # Legacy local images (fallback only)
    └── misc/                   # Static assets (logo, icons, etc.)
```

## Image Management - Google Drive Integration

All images are now managed through Google Drive, eliminating the need to store images in the repository. This provides:

- **Centralized Management**: All images in one place (Google Drive)
- **Easy Updates**: Add/remove images directly from Google Drive interface
- **No Repository Size**: Images are not stored in git
- **Automatic Syncing**: Images are fetched dynamically from Google Drive
- **Better Organization**: Organize images in folders by category

### Setup Google Drive Images

#### Option 1: Master Folder Structure (Recommended - Simplest)

1. **Create Master Folder:**
   - Create a single Google Drive folder (e.g., "Holly Valley Images")
   - This will be your master folder containing all subfolders

2. **Create Subfolders Inside Master Folder:**
   - Inside the master folder, create these subfolders (exact names):
     - `Store Images` (for home page slider)
     - `Groceries`
     - `Soft Drinks`
     - `Ice Bags`
     - `Frozen Pizza`
     - `Firewood`
     - `Ice Cream`
     - `Signage` (for digital signage)

3. **Share Master Folder Publicly:**
   - Right-click the master folder → "Share"
   - Set to "Anyone with the link can view"
   - All subfolders inherit this permission

4. **Get Master Folder ID:**
   - Open the master folder in Google Drive
   - Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID`
   - Example: If URL is `https://drive.google.com/drive/folders/1ABC123XYZ`, the ID is `1ABC123XYZ`

5. **Set Environment Variables:**
   - Add to your `.env` file:
     ```env
     REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID=1ABC123XYZ
     REACT_APP_GOOGLE_DRIVE_API_KEY=your-api-key
     ```
   - That's it! The system will automatically find all subfolders by name

#### Option 2: Individual Folder IDs (Alternative)

If you prefer separate folders:

1. **Create Separate Folders:**
   - Create individual folders for each category (same names as above)

2. **Share Each Folder Publicly:**
   - Right-click each folder → "Share" → "Anyone with the link can view"

3. **Get Folder IDs:**
   - Open each folder and copy the folder ID from the URL

4. **Set Environment Variables:**
   - Add individual folder IDs to `.env` file (see Environment Variables section)

#### Get Google Drive API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable "Google Drive API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and add to `.env` file

### Managing Images

**To Add Images:**
1. Upload images directly to the appropriate Google Drive folder
2. Images are automatically fetched and displayed on the website
3. Use numbered prefixes (01_, 02_, etc.) for ordering

**To Remove Images:**
1. Delete images from Google Drive folder
2. They will automatically be removed from the website

**To Reorder Images:**
1. Rename files in Google Drive with numbers: `01_Image.jpg`, `02_Image.jpg`, etc.
2. Files are sorted alphabetically by name

**To Update Images:**
1. Replace the image file in Google Drive with the same name
2. Or upload a new image and delete the old one

### Generating Image Lists (Optional)

You can pre-generate JSON files for faster loading:

```bash
npm run generate-all-images-gdrive
```

This generates JSON files in `public/api/` for all configured categories, which can be served statically for better performance.

### Migration from Local Images

**Before Migration:**
- Images were stored in `public/images/` folders
- Required repository updates to change images
- Increased repository size with image files

**After Migration:**
- All images are stored in Google Drive folders
- No images stored in repository (except static assets like logos)
- Images can be updated directly in Google Drive
- Automatic fetching on page load

**What to Keep:**
- `public/images/misc/` - Static assets like logos and icons (keep these in repository)
- Any other static assets that don't change frequently

**What Can Be Removed:**
- `public/images/storeImages/` - Now in Google Drive
- `public/images/groceries/` - Now in Google Drive
- `public/images/soft-drinks/` - Now in Google Drive
- `public/images/frozen-pizza/` - Now in Google Drive
- Other product image folders - Now in Google Drive

**Fallback Behavior:**
- If Google Drive is not configured, the system falls back to local images in `public/images/`
- This ensures backward compatibility during migration

## Digital Signage (FireTV)

The website includes a digital signage feature accessible at `/signage` path, designed for FireTV displays. This feature:

- **Fullscreen Slideshow**: Displays images in a fullscreen, TV-optimized slideshow
- **Automatic Transitions**: Auto-advances through images with configurable timing
- **Google Drive Integration**: Dynamically fetches images from a Google Drive folder (configured via environment variable)
- **Auto-Refresh**: Automatically refreshes images daily to pick up new/removed images from Google Drive
- **Privacy Protection**: Image source is stored in environment variables, not in code
- **Clean Interface**: Bypasses header, footer, and age verification for uninterrupted viewing
- **TV Optimized**: Responsive design optimized for large displays and FireTV
- **Dynamic Updates**: Images automatically refresh from Google Drive daily

### Setting Up Digital Signage

**Note:** We use Google Drive for dynamic image loading. See `docs/DEPLOYMENT.md` for deployment setup.

#### Setting Up Signage with Google Drive

1. **Create and Share Google Drive Folder:**
   - Create a folder for signage images in Google Drive
   - Upload all signage images to this folder
   - Right-click the folder → "Share" → "Anyone with the link can view"
   - Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID`

2. **Set Environment Variable:**
   ```env
   REACT_APP_GOOGLE_DRIVE_API_KEY=your-api-key
   ```
   
3. **Optionally Configure Settings:**
   ```env
   REACT_APP_SIGNAGE_SLIDE_DURATION_MS=10000  # 10 seconds per slide
   REACT_APP_GOOGLE_DRIVE_FETCH_INTERVAL_DAYS=7  # Refresh weekly
   ```

5. **Build and deploy your application**
6. **Access the signage at:** `https://yourdomain.com/signage?token=YOUR_TOKEN`

#### Method 2: Using GitHub Actions (Automatic Updates)

GitHub Actions automatically updates images and deploys:

**Automatic Updates:**
- **On every push** to `master` - Fetches latest images and deploys immediately
- **Daily at 2 AM UTC** - Checks if deployment needed based on `REACT_APP_GOOGLE_DRIVE_FETCH_INTERVAL_DAYS`
- **Manual trigger** - Click "Run workflow" in Actions tab for on-demand updates (bypasses interval check)

**Interval-based deployments:**
- Set `REACT_APP_GOOGLE_DRIVE_FETCH_INTERVAL_DAYS` secret to control how often scheduled deployments happen
- `1` = Daily deployments, `7` = Weekly deployments, etc.
- Push and manual triggers always deploy immediately regardless of interval

**Setup:**
1. **Add GitHub Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add `REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID` (your master folder ID)
   - Add `REACT_APP_GOOGLE_DRIVE_API_KEY` (your API key)
   - Optionally add `REACT_APP_GOOGLE_DRIVE_FETCH_INTERVAL_DAYS` (default: 1)

2. **Deploy:** Every deployment automatically fetches latest images from Google Drive master folder!

**To change daily schedule:** Edit `.github/workflows/deploy.yml` cron expression (default: 2 AM UTC daily)

See `docs/DEPLOYMENT.md` for detailed deployment and GitHub Actions setup instructions.

#### Method 3: Manual JSON File

### Troubleshooting

If images don't load:
1. Check that `REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID` is set correctly in your `.env` file
2. Ensure `REACT_APP_GOOGLE_DRIVE_API_KEY` is set and valid
3. Verify the master folder contains a "Signage" subfolder with images
4. Ensure images are accessible (folder shared publicly)
5. Check browser console for detailed error messages
6. For Google Drive: Ensure folder is shared publicly and API key has Drive API enabled

## Technologies Used

- **React**: Frontend framework
- **React Router**: Client-side routing
- **Chakra UI**: UI component library
- **CSS3**: Styling with responsive design
- **JavaScript ES6+**: Modern JavaScript features

## Original Features Preserved

- Age verification system using sessionStorage
- Image slider functionality
- Accordion/collapsible sections
- Image zoom on click
- Responsive navigation
- All original styling and branding
- Google Maps integration
- Contact information

## Legal Compliance

- Age verification for restricted content
- Legal disclaimers and responsible gambling warnings
- Compliance with tobacco and lottery regulations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for Holly Valley convenience store. All rights reserved.
