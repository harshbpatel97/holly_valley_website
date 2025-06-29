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
│   └── Contact.css
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

## Technologies Used

- **React**: Frontend framework
- **React Router**: Client-side routing
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
