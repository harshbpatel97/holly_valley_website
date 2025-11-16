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

# OneDrive Share Link for Digital Signage
# Format options:
# 1. OneDrive share link: https://1drv.ms/f/s!TOKEN or https://1drv.ms/f/c/ID1/ID2?e=CODE
# 2. OneDrive Live link: https://onedrive.live.com/?id=TOKEN
# 3. JSON file URL: https://yourdomain.com/images.json
#    JSON format: ["url1", "url2", ...] or {"images": ["url1", "url2", ...]}
REACT_APP_ONEDRIVE_LINK=

# Slide duration in milliseconds (default: 5000 = 5 seconds)
REACT_APP_SIGNAGE_SLIDE_DURATION=5000

# Auto-refresh interval in milliseconds (default: 86400000 = 24 hours / 1 day)
# Images are automatically refreshed to pick up new/removed images from OneDrive
# Set to refresh once per day by default
REACT_APP_SIGNAGE_REFRESH_INTERVAL=86400000
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
- **OneDrive Integration**: Dynamically fetches images from a OneDrive share link (configured via environment variable)
- **Auto-Refresh**: Automatically refreshes images daily (once per day) to pick up new/removed images from OneDrive
- **Privacy Protection**: OneDrive link is stored in environment variables, not in code
- **Clean Interface**: Bypasses header, footer, and age verification for uninterrupted viewing
- **TV Optimized**: Responsive design optimized for large displays and FireTV
- **Multiple Link Formats**: Supports various OneDrive link formats including `/f/c/` folder links

### Setting Up Digital Signage

#### Method 1: Using OneDrive Share Link (Automatic)

1. Share your OneDrive folder containing JPEG images:
   - Right-click the folder in OneDrive
   - Select "Share" → "Anyone with the link" (read-only)
   - Copy the share link
   
2. Set `REACT_APP_ONEDRIVE_LINK` in your `.env` file with the OneDrive share link:
   ```env
   REACT_APP_ONEDRIVE_LINK=https://1drv.ms/f/s!YOUR_TOKEN_HERE
   ```

3. Optionally set `REACT_APP_SIGNAGE_SLIDE_DURATION` for slide timing (default: 5000ms = 5 seconds)
4. Optionally set `REACT_APP_SIGNAGE_REFRESH_INTERVAL` for auto-refresh timing (default: 86400000ms = 24 hours)
   - The slideshow automatically refreshes daily to pick up new/removed images from OneDrive
5. Build and deploy your application
6. Access the signage at: `https://yourdomain.com/signage`

#### Method 2: Using JSON File (Recommended - More Reliable)

This is the recommended method for `/f/c/` format OneDrive links and provides dynamic daily updates:

1. **Initial Setup - Generate JSON file:**
   ```bash
   npm run generate-signage-images "https://1drv.ms/f/c/YOUR_ID1/YOUR_ID2?e=CODE" public/api/signage-images.json
   ```
   This will create a JSON file with all image URLs from your OneDrive folder.

2. **Set environment variable:**
   ```env
   REACT_APP_ONEDRIVE_LINK=/api/signage-images.json
   ```

3. **Set up daily auto-refresh** (choose one method):

   **Option A: Cron Job (macOS/Linux):**
   ```bash
   # Edit crontab
   crontab -e
   
   # Add this line to run daily at 2 AM (adjust time as needed)
   # Replace /path/to/project with your actual project path
   0 2 * * * cd /path/to/holly_valley_website && npm run generate-signage-images "YOUR_ONEDRIVE_LINK" public/api/signage-images.json
   ```

   **Option B: Scheduled Task (Windows):**
   - Open Task Scheduler
   - Create Basic Task
   - Set trigger to "Daily" at your preferred time
   - Set action to run:
     ```cmd
     cmd /c "cd C:\path\to\holly_valley_website && npm run generate-signage-images YOUR_ONEDRIVE_LINK public/api/signage-images.json"
     ```

   **Option C: Manual Refresh:**
   Simply run the script whenever you want to update images:
   ```bash
   npm run generate-signage-images "YOUR_ONEDRIVE_LINK" public/api/signage-images.json
   ```

4. **Rebuild and deploy:**
   ```bash
   npm run build
   ```

The React app will automatically check for updated images once per day (default: every 24 hours). When you add or remove images from OneDrive, they will appear in the slideshow after the next daily refresh cycle completes.

#### Method 3: Manual JSON File

Create a JSON file manually with your image URLs:

```json
[
  "https://direct-url-to-image-1.jpg",
  "https://direct-url-to-image-2.jpg",
  "https://direct-url-to-image-3.jpg"
]
```

Save it as `public/api/signage-images.json` and set `REACT_APP_ONEDRIVE_LINK=/api/signage-images.json`

### OneDrive Share Link Formats Supported

- `https://1drv.ms/f/s!TOKEN` - OneDrive share link (most common)
- `https://1drv.ms/u/s!TOKEN` - OneDrive user share link
- `https://onedrive.live.com/?id=TOKEN` - OneDrive Live link
- JSON file URL with format: `["url1", "url2", ...]` or `{"images": ["url1", "url2", ...]}`

### Troubleshooting

If you get "Invalid OneDrive link format" error:
1. Ensure the folder is shared with "Anyone with the link" permission
2. Verify the link format matches one of the supported formats
3. Try using Method 2 (JSON file) for more reliable access
4. Check browser console for detailed error messages

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
