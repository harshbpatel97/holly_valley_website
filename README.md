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

## Pages

- **Home**: Welcome page with image slider, about us, address, and hours
- **Services**: ATM, payment methods, and NC Lottery information
- **Products**: Groceries and tobacco products with image galleries
- **Contact**: Contact information and location details

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd holly-valley-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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
├── App.js                      # Main app component with routing
├── App.css                     # Global styles
└── index.js                    # App entry point
```

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for Holly Valley convenience store. All rights reserved.
