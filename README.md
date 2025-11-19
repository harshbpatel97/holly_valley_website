# Holly Valley React Website

This is a React conversion of the original Holly Valley static HTML website. The React version maintains all the original functionality while providing a modern, component-based architecture.

## Features

- **Age Verification**: Age verification modal that appears on first visit
- **Responsive Design**: Mobile-friendly layout that works on all devices
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

# Image Source for Digital Signage
# Format options:
# 1. JSON file URL: /api/signage-images.json or https://yourdomain.com/images.json
# 2. Google Drive proxy URL: http://localhost:3001/api/googledrive/images?folderId=FOLDER_ID&apiKey=API_KEY
#    JSON format: ["url1", "url2", ...] or {"images": ["url1", "url2", ...]}
REACT_APP_SIGNAGE_IMG_REF_LINK=/api/signage-images.json

# Slide duration in milliseconds (default: 10000 = 10 seconds)
REACT_APP_SIGNAGE_SLIDE_DURATION_MS=10000

# Auto-refresh interval in days (default: 1 = refresh daily)
# Images are automatically refreshed to pick up new/removed images
# Set to refresh once per day by default (value: 1)
REACT_APP_SIGNAGE_REFRESH_INTERVAL_DAYS=1

# Access token for signage page (required for security)
# Access signage via: /signage?token=YOUR_TOKEN_HERE
# If not set, signage page will be publicly accessible
REACT_APP_SIGNAGE_TOKEN=your-secret-token-here
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
│   ├── storeImages.js          # Store images configuration
│   └── productImages.js        # Product images configuration
├── App.js                      # Main app component with routing
├── App.css                     # Global styles
└── index.js                    # App entry point
public/
├── images/
│   ├── storeImages/            # Store interior/exterior images
│   ├── groceries/              # Grocery product images
│   └── soft-drinks/            # Soft drink product images
```

## Image Management Systems

### Store Images Management
- **Configuration**: `src/config/storeImages.js`
- **Directory**: `public/images/storeImages/`
- **Purpose**: Manages store interior and exterior images for the home page slider
- **Features**: Easy to add, remove, and reorder images
- **Documentation**: See comments in configuration file

### Product Images Management
- **Configuration**: `src/config/productImages.js`
- **Directories**: 
  - `public/images/groceries/` (16 products)
  - `public/images/soft-drinks/` (12 products)
- **Purpose**: Manages product images for the Products page
- **Features**: Category-based organization, easy management
- **Documentation**: See `PRODUCT_IMAGES_README.md` for detailed guide

### Quick Image Management
To add a new product:
1. Place image in appropriate directory
2. Add entry to configuration file
3. Save and refresh

To remove a product:
1. Delete entry from configuration
2. Optionally remove image file

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

#### Method 1: Using Google Drive (Recommended - Automatic)

1. **Get Google Drive API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable "Google Drive API"
   - Create an API key (see `docs/DEPLOYMENT.md` for detailed instructions)

2. **Share your Google Drive folder:**
   - Upload images to a folder in Google Drive
   - Right-click the folder → "Share" → "Anyone with the link can view"
   - Copy the folder ID from the URL: `https://drive.google.com/drive/folders/FOLDER_ID`

3. **Generate JSON file:**
   ```bash
   npm run generate-signage-images-gdrive "FOLDER_ID" public/api/signage-images.json "YOUR_API_KEY"
   ```

4. **Set environment variable:**
   ```env
   REACT_APP_SIGNAGE_IMG_REF_LINK=/api/signage-images.json
   ```

5. **Optionally set slide timing:**
   ```env
   REACT_APP_SIGNAGE_SLIDE_DURATION_MS=10000  # 10 seconds per slide
   REACT_APP_SIGNAGE_REFRESH_INTERVAL_DAYS=1  # Refresh daily
   ```

6. **Build and deploy your application**
7. **Access the signage at:** `https://yourdomain.com/signage`

#### Method 2: Using GitHub Actions (Automatic Updates)

GitHub Actions automatically updates images and deploys:

**Automatic Updates:**
- **On every push** to `master` - Fetches latest images and deploys immediately
- **Daily at 2 AM UTC** - Checks if deployment needed based on `REACT_APP_SIGNAGE_REFRESH_INTERVAL_DAYS`
- **Manual trigger** - Click "Run workflow" in Actions tab for on-demand updates (bypasses interval check)

**Interval-based deployments:**
- Set `REACT_APP_SIGNAGE_REFRESH_INTERVAL_DAYS` secret to control how often scheduled deployments happen
- `1` = Daily deployments, `7` = Weekly deployments, etc.
- Push and manual triggers always deploy immediately regardless of interval

**Setup:**
1. **Add GitHub Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add `GOOGLE_DRIVE_FOLDER_ID` (your folder ID)
   - Add `GOOGLE_DRIVE_API_KEY` (your API key)

2. **Set environment variable:**
   ```env
   REACT_APP_SIGNAGE_IMG_REF_LINK=/api/signage-images.json
   ```

3. **Deploy:** Every deployment automatically fetches latest images from Google Drive!

**To change daily schedule:** Edit `.github/workflows/deploy.yml` cron expression (default: 2 AM UTC daily)

See `docs/DEPLOYMENT.md` for detailed deployment and GitHub Actions setup instructions.

#### Method 3: Manual JSON File

Create a JSON file manually with your image URLs:

```json
[
  "https://direct-url-to-image-1.jpg",
  "https://direct-url-to-image-2.jpg",
  "https://direct-url-to-image-3.jpg"
]
```

Save it as `public/api/signage-images.json` and set:
```env
REACT_APP_SIGNAGE_IMG_REF_LINK=/api/signage-images.json
```

### Troubleshooting

If images don't load:
1. Check that `REACT_APP_SIGNAGE_IMG_REF_LINK` is set correctly in your `.env` file
2. Verify the JSON file contains valid image URLs
3. Ensure images are accessible (not behind authentication)
4. Check browser console for detailed error messages
5. For Google Drive: Ensure folder is shared publicly and API key is valid

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
