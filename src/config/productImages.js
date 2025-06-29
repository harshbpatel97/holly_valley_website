// Product Images Configuration
// All product images are dynamically loaded from a JSON file that lists directory contents
// To add a new product: Just add the image file to the appropriate directory and update the JSON
// To remove a product: Just delete the image file and remove from JSON
// To reorder products: Change the order in the JSON file

// Helper function to generate product properties from filename
const generateProductFromImage = (filename, categoryPath) => {
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, ""); // Remove file extension
  
  // Remove numbered prefix if present (e.g., "01 - Bread.jpg" -> "Bread.jpg")
  const cleanName = nameWithoutExtension.replace(/^\d+\s*-\s*/, "");
  
  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Convert to URL-friendly ID
  const src = `/images/${categoryPath}/${filename}`;
  const alt = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const caption = cleanName; // Use clean filename as caption
  
  return { id, src, alt, caption };
};

// Dynamic image loading using fetch to read from JSON file
const loadImagesFromDirectory = async (categoryPath) => {
  try {
    // Fetch the JSON file that contains all image listings
    const response = await fetch('/api/images.json');
    
    if (!response.ok) {
      console.warn('Could not load images.json, using fallback');
      return getFallbackImages(categoryPath);
    }
    
    const data = await response.json();
    const files = data[categoryPath] || [];
    
    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort();
    
    // Generate product objects
    return imageFiles.map(filename => generateProductFromImage(filename, categoryPath));
  } catch (error) {
    console.warn(`Could not load images from ${categoryPath}:`, error);
    return getFallbackImages(categoryPath);
  }
};

// Fallback function for development (when JSON is not available)
const getFallbackImages = (categoryPath) => {
  // This is a temporary fallback - in production, you'd have the JSON file
  const fallbackFiles = {
    'groceries': [
      'Bread.jpg',
      'Cheetos.jpg',
      'Chocolates.jpg',
      'Chewing-Gums.jpg',
      'Skittles.jpg',
      'Rice Krispies Treats.jpg',
      'Cleaning Sprays.jpg',
      'Dawn Liquid Wash.jpg',
      'Lays.jpg',
      'Dial Handwash.jpg',
      'Dog Products.jpg',
      'Doritos.jpg',
      'Dove Products.jpg',
      'Eggs.jpg',
      'Dairy Products.jpg',
      'Funyuns.jpg'
    ],
    'soft-drinks': [
      'Coca Cola.jpg',
      'Pepsi.jpg',
      'Sprite.jpg',
      'Fanta.jpg',
      '7UP.jpg',
      'Dr Pepper.jpg',
      'Sunkist.jpg',
      'A&W.jpg',
      'Canada Dry.jpg',
      'Tea.jpg',
      'Brisk Tea.jpg',
      'Starbucks.jpg'
    ],
    'ice-bags': [
      'Ice Bag 1.jpg',
      'Ice Bag 2.jpg',
      'Ice Bag 3.jpg',
      'Ice Bag 4.jpg',
      'Ice Bag 5.jpg'
    ],
    'frozen-pizza': [
      'Frozen Pizza 1.jpg',
      'Frozen Pizza 2.jpg',
      'Frozen Pizza 3.jpg',
      'Frozen Pizza 4.jpg',
      'Frozen Pizza 5.jpg',
      'Frozen Pizza 6.jpg'
    ],
    'firewood': [
      'Firewood Bundle 1.jpg',
      'Firewood Bundle 2.jpg',
      'Firewood Bundle 3.jpg',
      'Firewood Bundle 4.jpg',
      'Firewood Bundle 5.jpg'
    ],
    'ice-cream': [
      'Ice Cream 1.jpg',
      'Ice Cream 2.jpg',
      'Ice Cream 3.jpg',
      'Dippin Dots 1.jpg',
      'Dippin Dots 2.jpg',
      'Dippin Dots 3.jpg'
    ]
  };
  
  const files = fallbackFiles[categoryPath] || [];
  return files.map(filename => generateProductFromImage(filename, categoryPath));
};

// Create a simple API endpoint for development
const createImageAPI = () => {
  // This simulates an API endpoint by reading from a JSON file
  // In production, you'd have a real server endpoint
  const apiData = {
    'groceries': [
      'Bread.jpg',
      'Cheetos.jpg',
      'Chocolates.jpg',
      'Chewing-Gums.jpg',
      'Skittles.jpg',
      'Rice Krispies Treats.jpg',
      'Cleaning Sprays.jpg',
      'Dawn Liquid Wash.jpg',
      'Lays.jpg',
      'Dial Handwash.jpg',
      'Dog Products.jpg',
      'Doritos.jpg',
      'Dove Products.jpg',
      'Eggs.jpg',
      'Dairy Products.jpg',
      'Funyuns.jpg'
    ],
    'soft-drinks': [
      'Coca Cola.jpg',
      'Pepsi.jpg',
      'Sprite.jpg',
      'Fanta.jpg',
      '7UP.jpg',
      'Dr Pepper.jpg',
      'Sunkist.jpg',
      'A&W.jpg',
      'Canada Dry.jpg',
      'Tea.jpg',
      'Brisk Tea.jpg',
      'Starbucks.jpg'
    ]
  };
  
  // Mock the fetch API for development
  global.fetch = global.fetch || (async (url) => {
    const categoryPath = url.split('/').pop();
    return {
      ok: true,
      json: async () => apiData[categoryPath] || []
    };
  });
};

// Initialize the API for development
createImageAPI();

export const productCategories = {
  groceries: {
    id: 'groceries',
    title: 'Groceries',
    description: 'All the grocery items are available in single or combo pack depending on the type. Moreover, we do carry different brands of the items. For more information, visit the local store.',
    items: getFallbackImages('groceries') // Start with fallback, will be updated dynamically
  },
  softdrinks: {
    id: 'softdrinks',
    title: 'Soft Drinks',
    description: 'We offer a wide variety of soft drinks, sodas, and beverages from popular brands. All beverages are available in different sizes and flavors.',
    items: getFallbackImages('soft-drinks') // Start with fallback, will be updated dynamically
  },
  icebags: {
    id: 'icebags',
    title: 'Ice Bags',
    description: 'We carry various sizes of ice bags for your convenience. Perfect for parties, events, or everyday use. Available in different quantities.',
    items: getFallbackImages('ice-bags') // Start with fallback, will be updated dynamically
  },
  frozenpizza: {
    id: 'frozenpizza',
    title: 'Frozen Pizza',
    description: 'A selection of frozen pizzas from popular brands. Available in different sizes and flavors including cheese, pepperoni, and specialty varieties.',
    items: getFallbackImages('frozen-pizza') // Start with fallback, will be updated dynamically
  },
  firewood: {
    id: 'firewood',
    title: 'Firewood Bundles',
    description: 'Quality firewood bundles for your fireplace, fire pit, or wood stove. Available in various sizes and quantities. Perfect for heating and outdoor activities.',
    items: getFallbackImages('firewood') // Start with fallback, will be updated dynamically
  },
  icecream: {
    id: 'icecream',
    title: 'Ice Cream & Dippin Dots',
    description: 'We carry a wide variety of ice cream brands and frozen treats including Good Humor, Ben & Jerry\'s, Magnum, Talenti, Popsicle, Klondike, Breyers, Mars, Rich\'s Ice Cream, Dippin Dots, and many more. Available in different sizes and flavors. Perfect for hot days and sweet cravings.',
    items: getFallbackImages('ice-cream') // Start with fallback, will be updated dynamically
  }
};

// Helper function to get all product categories
export const getAllProductCategories = () => {
  return Object.values(productCategories);
};

// Helper function to get a specific category
export const getProductCategory = (categoryId) => {
  return productCategories[categoryId];
};

// Function to refresh images dynamically
export const refreshProductImages = async () => {
  try {
    const groceries = await loadImagesFromDirectory('groceries');
    const softdrinks = await loadImagesFromDirectory('soft-drinks');
    const icebags = await loadImagesFromDirectory('ice-bags');
    const frozenpizza = await loadImagesFromDirectory('frozen-pizza');
    const firewood = await loadImagesFromDirectory('firewood');
    const icecream = await loadImagesFromDirectory('ice-cream');
    
    productCategories.groceries.items = groceries;
    productCategories.softdrinks.items = softdrinks;
    productCategories.icebags.items = icebags;
    productCategories.frozenpizza.items = frozenpizza;
    productCategories.firewood.items = firewood;
    productCategories.icecream.items = icecream;
    
    console.log('Product images refreshed dynamically');
  } catch (error) {
    console.warn('Could not refresh images dynamically:', error);
  }
};

// Instructions for managing product images:
/*
DYNAMIC SYSTEM: All product images are dynamically loaded from a JSON file

SETUP:
1. The system reads from public/api/images.json
2. This JSON file lists all images in each directory
3. When you add/remove images, just update the JSON file

To ADD a new product:
1. Place the product image in the appropriate directory:
   - Groceries: public/images/groceries/
   - Soft Drinks: public/images/soft-drinks/
2. Name the file exactly as you want it to appear as the caption
   - Example: "New Snack Brand.jpg" will display as "New Snack Brand"
3. Add the filename to the appropriate array in public/api/images.json
4. The system will automatically detect and include the new image

To REMOVE a product:
1. Delete the image file from the directory
2. Remove the filename from the JSON file
3. The system will automatically remove it from the display

To REORDER products:
1. Simply change the order of filenames in the JSON file
2. The display order will automatically reflect the new arrangement

To ADD a new category:
1. Create a new directory in public/images/
2. Add a new category object to productCategories
3. Add the category to public/api/images.json
4. Include: id, title, description, and items: await loadImagesFromDirectory('new-category')

RECOMMENDED NAMING CONVENTIONS:
- Image files: Use proper case for display (e.g., 'New Snack Brand.jpg', 'Energy Drink.jpg')
- The system will automatically convert to URL-friendly IDs
- Captions will match the filename exactly

EXAMPLE ADDING NEW PRODUCT:
1. Add "Energy Drink.jpg" to public/images/soft-drinks/
2. Add 'Energy Drink.jpg' to the "soft-drinks" array in public/api/images.json
3. System automatically generates all properties

BENEFITS:
- Dynamic: No manual array maintenance in code
- File system driven: Just add/remove files and update JSON
- No configuration errors: Impossible to have mismatched files
- Easy ordering: Just reorder in JSON
- Zero code changes: System handles everything automatically
- JSON-based: Easy to edit and maintain
*/ 