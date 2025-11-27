import { useState, useEffect } from 'react';
import { fetchImagesFromGoogleDriveFolder, fetchImagesFromGoogleDriveProxy, findSubfolderByName, generateProductFromGoogleDriveImage, normalizeGoogleDriveImageUrl } from '../utils/googleDriveImages';

// Product Images Configuration - Now uses Google Drive
// Images are fetched from Google Drive folders configured via environment variables

// Support master folder (with subfolders) or individual folder IDs
const MASTER_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID; // Master folder containing all subfolders

// Direct folder IDs (fallback if master folder not used)
const PRODUCT_FOLDERS = {
  groceries: process.env.REACT_APP_GROCERIES_FOLDER_ID,
  softdrinks: process.env.REACT_APP_SOFT_DRINKS_FOLDER_ID,
  icebags: process.env.REACT_APP_ICE_BAGS_FOLDER_ID,
  frozenpizza: process.env.REACT_APP_FROZEN_PIZZA_FOLDER_ID,
  firewood: process.env.REACT_APP_FIREWOOD_FOLDER_ID,
  icecream: process.env.REACT_APP_ICE_CREAM_FOLDER_ID
};

// Subfolder name mapping for master folder structure
const PRODUCT_SUBFOLDER_NAMES = {
  groceries: 'Groceries',
  softdrinks: 'Soft Drinks',
  icebags: 'Ice Bags',
  frozenpizza: 'Frozen Pizza',
  firewood: 'Firewood',
  icecream: 'Ice Cream'
};

// Proxy URLs (optional - alternative to direct folder IDs)
const PRODUCT_PROXY_URLS = {
  groceries: process.env.REACT_APP_GROCERIES_PROXY_URL,
  softdrinks: process.env.REACT_APP_SOFT_DRINKS_PROXY_URL,
  icebags: process.env.REACT_APP_ICE_BAGS_PROXY_URL,
  frozenpizza: process.env.REACT_APP_FROZEN_PIZZA_PROXY_URL,
  firewood: process.env.REACT_APP_FIREWOOD_PROXY_URL,
  icecream: process.env.REACT_APP_ICE_CREAM_PROXY_URL
  };
  
// Product categories configuration
export const productCategories = {
  groceries: {
    id: 'groceries',
    title: 'Groceries',
    description: 'All the grocery items are available in single or combo pack depending on the type. Moreover, we do carry different brands of the items. For more information, visit the local store.',
    items: []
  },
  softdrinks: {
    id: 'softdrinks',
    title: 'Soft Drinks',
    description: 'We offer a wide variety of soft drinks, sodas, and beverages from popular brands. All beverages are available in different sizes and flavors.',
    items: []
  },
  icebags: {
    id: 'icebags',
    title: 'Ice Bags',
    description: 'We carry various sizes of ice bags for your convenience. Perfect for parties, events, or everyday use. Available in different quantities.',
    items: []
  },
  frozenpizza: {
    id: 'frozenpizza',
    title: 'Frozen Pizza',
    description: 'A selection of frozen pizzas from popular brands. Available in different sizes and flavors including cheese, pepperoni, and specialty varieties.',
    items: []
  },
  firewood: {
    id: 'firewood',
    title: 'Firewood Bundles',
    description: 'Quality firewood bundles for your fireplace, fire pit, or wood stove. Available in various sizes and quantities. Perfect for heating and outdoor activities.',
    items: []
  },
  icecream: {
    id: 'icecream',
    title: 'Ice Cream & Dippin Dots',
    description: 'We carry a wide variety of ice cream brands and frozen treats including Good Humor, Ben & Jerry\'s, Magnum, Talenti, Popsicle, Klondike, Breyers, Mars, Rich\'s Ice Cream, Dippin Dots, and many more. Available in different sizes and flavors. Perfect for hot days and sweet cravings.',
    items: []
  }
};

/**
 * Load images for a specific category from Google Drive
 * @param {string} categoryId - Category ID (groceries, softdrinks, etc.)
 * @returns {Promise<Array>} Array of product image objects
 */
const loadCategoryImages = async (categoryId) => {
  let folderId = PRODUCT_FOLDERS[categoryId];
  const proxyUrl = PRODUCT_PROXY_URLS[categoryId];

  try {
    let images = [];

    // Try proxy URL first if configured
    if (proxyUrl) {
      try {
        const imageUrls = await fetchImagesFromGoogleDriveProxy(proxyUrl);
        images = imageUrls.map((url, index) => {
          const name = `Product ${index + 1}`;
          // normalizeGoogleDriveImageUrl is already called in generateProductFromGoogleDriveImage
          return generateProductFromGoogleDriveImage({ id: `img-${index}`, name, url }, categoryId);
        });
      } catch (err) {
        console.warn(`Failed to fetch ${categoryId} from proxy, trying direct API:`, err);
      }
    }

    // Check if API key is available
    const hasApiKey = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY && process.env.REACT_APP_GOOGLE_DRIVE_API_KEY.trim() !== '';
    
    // If no direct folder ID, try to find subfolder in master folder
    if (!folderId && MASTER_FOLDER_ID && hasApiKey) {
      const subfolderName = PRODUCT_SUBFOLDER_NAMES[categoryId];
      if (subfolderName) {
        try {
          folderId = await findSubfolderByName(MASTER_FOLDER_ID, subfolderName);
        } catch (err) {
          if (err.message && err.message.includes('API key')) {
            console.error(`API key error for ${categoryId}:`, err.message);
          } else {
            console.warn(`Failed to find ${categoryId} subfolder in master folder:`, err);
          }
        }
      }
    }

    // Try direct Google Drive API if folder ID is available
    if (images.length === 0 && folderId) {
      if (!hasApiKey) {
        console.warn(`Skipping ${categoryId}: API key is missing`);
        return [];
      }
      try {
        const driveImages = await fetchImagesFromGoogleDriveFolder(folderId);
        images = driveImages.map(image => generateProductFromGoogleDriveImage(image, categoryId));
      } catch (err) {
        if (err.message && err.message.includes('API key')) {
          console.error(`API key error for ${categoryId}:`, err.message);
        } else {
          console.error(`Failed to fetch ${categoryId} images from Google Drive:`, err);
        }
        return [];
      }
    }

    return images;
  } catch (error) {
    console.error(`Error loading ${categoryId} images:`, error);
    return [];
  }
};

/**
 * Hook to fetch all product images from Google Drive
 * @returns {Object} {categories, loading, error}
 */
export const useProductImages = () => {
  const [categories, setCategories] = useState(productCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllProductImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryIds = Object.keys(productCategories);
        const updatedCategories = { ...productCategories };
        let totalImagesLoaded = 0;
        const errors = [];

        // Load images for each category
        for (const categoryId of categoryIds) {
          try {
            const images = await loadCategoryImages(categoryId);
            if (images.length > 0) {
              // Double-check normalization (in case URLs came from cache or proxy)
              const normalizedImages = images.map(img => ({
                ...img,
                src: normalizeGoogleDriveImageUrl(img.src)
              }));
              updatedCategories[categoryId].items = normalizedImages;
              totalImagesLoaded += normalizedImages.length;
              console.log(`✓ Loaded ${normalizedImages.length} images for ${categoryId}`);
              // Verify first image is using thumbnail format
              if (normalizedImages.length > 0 && !normalizedImages[0].src.includes('drive.google.com/thumbnail')) {
                console.warn(`⚠ First ${categoryId} image not in thumbnail format: ${normalizedImages[0].src.substring(0, 100)}`);
              }
            } else {
              console.warn(`⚠ No images loaded for ${categoryId}`);
            }
          } catch (err) {
            const errorMsg = `Failed to load ${categoryId}: ${err.message}`;
            console.error(errorMsg);
            errors.push(errorMsg);
          }
        }

        setCategories(updatedCategories);

        // Set error if no images were loaded at all
        if (totalImagesLoaded === 0) {
          const hasMasterFolder = process.env.REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID;
          const hasApiKey = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY && process.env.REACT_APP_GOOGLE_DRIVE_API_KEY.trim() !== '';
          
          if (!hasApiKey) {
            setError('Google Drive API key is missing. Please set REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.');
          } else if (!hasMasterFolder && !Object.values(PRODUCT_FOLDERS).some(id => id)) {
            setError('No Google Drive folder configuration found. Please set REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID or individual folder IDs in your .env file.');
          } else {
            setError('No product images found. Please check: 1) Folders exist and are shared publicly, 2) Images are in the correct subfolders, 3) Subfolder names match exactly (Groceries, Soft Drinks, etc.)');
          }
        } else if (errors.length > 0) {
          // Some categories failed but others succeeded
          console.warn('Some categories failed to load:', errors);
        }
      } catch (err) {
        console.error('Error loading product images:', err);
        setError(err.message || 'Failed to load product images. Please check the browser console for details.');
      } finally {
        setLoading(false);
      }
    };

    loadAllProductImages();
  }, []);

  return { categories, loading, error };
};

/**
 * Function to refresh all product images (for manual refresh)
 */
export const refreshProductImages = async () => {
  try {
    const categoryIds = Object.keys(productCategories);

    for (const categoryId of categoryIds) {
      const images = await loadCategoryImages(categoryId);
      if (images.length > 0) {
        productCategories[categoryId].items = images;
      }
    }
  } catch (error) {
    console.error('Error refreshing product images:', error);
  }
};

/**
 * Helper function to get all product categories
 */
export const getAllProductCategories = () => {
  return Object.values(productCategories);
};

/**
 * Helper function to get a specific category
 */
export const getProductCategory = (categoryId) => {
  return productCategories[categoryId];
};

// Instructions for managing product images:
/*
GOOGLE DRIVE SYSTEM: All product images are now stored in Google Drive

SETUP:
1. Create Google Drive folders for each product category
2. Upload product images to their respective folders
3. Share each folder: Right-click → Share → "Anyone with the link can view"
4. Copy folder IDs from URLs: https://drive.google.com/drive/folders/FOLDER_ID
5. Set environment variables for each category:
   
   REACT_APP_GROCERIES_FOLDER_ID=YOUR_GROCERIES_FOLDER_ID
   REACT_APP_SOFT_DRINKS_FOLDER_ID=YOUR_SOFT_DRINKS_FOLDER_ID
   REACT_APP_ICE_BAGS_FOLDER_ID=YOUR_ICE_BAGS_FOLDER_ID
   REACT_APP_FROZEN_PIZZA_FOLDER_ID=YOUR_FROZEN_PIZZA_FOLDER_ID
   REACT_APP_FIREWOOD_FOLDER_ID=YOUR_FIREWOOD_FOLDER_ID
   REACT_APP_ICE_CREAM_FOLDER_ID=YOUR_ICE_CREAM_FOLDER_ID

OR use proxy URLs:
   REACT_APP_GROCERIES_PROXY_URL=/api/googledrive/images?folderId=YOUR_FOLDER_ID
   (same pattern for other categories)

To ADD a new product:
1. Upload the image to the appropriate Google Drive folder
2. Images are automatically fetched and displayed
3. Use descriptive filenames (e.g., "Bread.jpg", "Coca Cola.jpg")

To REMOVE a product:
1. Delete the image from Google Drive folder
2. It will automatically be removed from the display

To REORDER products:
1. Rename files with numbers: 01_Bread.jpg, 02_Cheetos.jpg, etc.
2. Files are sorted alphabetically by name

BENEFITS:
- No need to store images in repository
- Easy to manage via Google Drive web interface
- Automatic updates when images are added/removed
- Centralized image storage
*/
