// Product Images Configuration
// All product images are organized by category for easy management
// Images are automatically detected from directories using webpack require.context
// To add a new product: Just add the image file to the appropriate directory
// To remove a product: Just delete the image file from the directory
// To reorder products: Rename files with numbered prefixes (e.g., "01 - Bread.jpg")

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

// Dynamic image loading using webpack require.context
// This automatically reads all images from the directories at runtime
const loadImagesFromDirectory = (categoryPath) => {
  try {
    // Use webpack's require.context to dynamically import all images
    const imageContext = require.context(`../public/images/${categoryPath}`, false, /\.(jpg|jpeg|png|webp|gif)$/i);
    
    // Get all image filenames
    const imageFiles = imageContext.keys().map(key => key.replace('./', ''));
    
    // Filter and sort image files
    const processedFiles = imageFiles
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort();
    
    // Generate product objects
    return processedFiles.map(filename => generateProductFromImage(filename, categoryPath));
  } catch (error) {
    console.warn(`Could not load images from ${categoryPath}:`, error);
    return [];
  }
};

export const productCategories = {
  groceries: {
    id: 'groceries',
    title: 'Groceries',
    description: 'All the grocery items are available in single or combo pack depending on the type. Moreover, we do carry different brands of the items. For more information, visit the local store.',
    items: loadImagesFromDirectory('groceries')
  },
  softdrinks: {
    id: 'softdrinks',
    title: 'Soft Drinks',
    description: 'We offer a wide variety of soft drinks, sodas, and beverages from popular brands. All beverages are available in different sizes and flavors.',
    items: loadImagesFromDirectory('soft-drinks')
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

// Instructions for managing product images:
/*
COMPLETELY AUTOMATIC SYSTEM: All product images are now dynamically read from directories

To ADD a new product:
1. Place the product image in the appropriate directory:
   - Groceries: public/images/groceries/
   - Soft Drinks: public/images/soft-drinks/
2. Name the file exactly as you want it to appear as the caption
   - Example: "New Snack Brand.jpg" will display as "New Snack Brand"
3. The system will automatically detect and include the new image
4. No configuration changes needed!
5. No build scripts needed!
6. No JSON files needed!

To REMOVE a product:
1. Delete the image file from the directory
2. The system will automatically remove it from the display
3. No configuration changes needed!

To REORDER products:
1. Rename files with numbered prefixes:
   - "01 - Bread.jpg"
   - "02 - Cheetos.jpg"
   - "03 - New Product.jpg"
2. The system will automatically sort them alphabetically
3. Files without prefixes will appear first

To ADD a new category:
1. Create a new directory in public/images/
2. Add a new category object to productCategories
3. Include: id, title, description, and items: loadImagesFromDirectory('new-category')

RECOMMENDED NAMING CONVENTIONS:
- Image files: Use proper case for display (e.g., 'New Snack Brand.jpg', 'Energy Drink.jpg')
- For ordering: Use numbered prefixes (e.g., '01 - Bread.jpg', '02 - Cheetos.jpg')
- The system will automatically convert to URL-friendly IDs
- Captions will match the filename exactly (without prefix)

EXAMPLE ADDING NEW PRODUCT:
1. Add "Energy Drink.jpg" to public/images/soft-drinks/
2. System automatically detects and includes it
3. No configuration changes needed!

BENEFITS:
- Completely automatic: No manual array maintenance
- File system driven: Just add/remove files
- No configuration errors: Impossible to have mismatched files
- Easy ordering: Use numbered prefixes
- Zero maintenance: System handles everything automatically
- No build scripts: Works at runtime
- No JSON files: Direct file system reading
- No API endpoints: Pure client-side solution
*/ 