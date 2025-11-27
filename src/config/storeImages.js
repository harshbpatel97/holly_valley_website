import { useState, useEffect } from 'react';
import { fetchImagesFromGoogleDriveFolder, findSubfolderByName, generateStoreImageFromGoogleDrive } from '../utils/googleDriveImages';

// Store Images Configuration - Now uses Google Drive
// Images are fetched from Google Drive folder configured via environment variable

// Support both master folder (with subfolders) and direct folder ID
const MASTER_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID; // Master folder containing all subfolders
const STORE_IMAGES_FOLDER_ID = process.env.REACT_APP_STORE_IMAGES_FOLDER_ID; // Direct folder ID (fallback)
const STORE_IMAGES_SUBFOLDER_NAME = 'Store Images'; // Name of subfolder in master folder
const STORE_IMAGES_PROXY_URL = process.env.REACT_APP_STORE_IMAGES_PROXY_URL; // Optional proxy URL

// Fallback store images (used if Google Drive is not configured)
const fallbackStoreImages = [
  {
    id: 'front-view',
    src: '/images/storeImages/01_store_front_view.jpg',
    alt: 'Front View',
    title: 'Front View',
    description: 'Front view of Holly Valley store'
  },
  {
    id: 'left-view',
    src: '/images/storeImages/02_store_left_view.jpg',
    alt: 'Left Side View',
    title: 'Left Side View',
    description: 'Left side view of Holly Valley store'
  },
  {
    id: 'right-view',
    src: '/images/storeImages/03_store_right_view.jpg',
    alt: 'Right Side View',
    title: 'Right Side View',
    description: 'Right side view of Holly Valley store'
  }
];

/**
 * Hook to fetch store images from Google Drive
 * @returns {Object} {storeImages, loading, error}
 */
export const useStoreImages = () => {
  const [storeImages, setStoreImages] = useState(fallbackStoreImages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoreImages = async () => {
      setLoading(true);
      setError(null);

      try {
        let images = [];

        // Try proxy URL first if configured
        if (STORE_IMAGES_PROXY_URL) {
          try {
            const { fetchImagesFromGoogleDriveProxy, normalizeGoogleDriveImageUrl } = await import('../utils/googleDriveImages');
            const imageUrls = await fetchImagesFromGoogleDriveProxy(STORE_IMAGES_PROXY_URL);
            images = imageUrls.map((url, index) => ({
              id: `store-image-${index}`,
              src: normalizeGoogleDriveImageUrl(url), // Normalize to thumbnail format
              alt: `Store Image ${index + 1}`,
              title: `Store Image ${index + 1}`,
              description: `Store image ${index + 1} of Holly Valley`
            }));
          } catch (err) {
            console.warn('Failed to fetch from proxy, trying direct API:', err);
          }
        }

        // Check if API key is available before attempting any Google Drive operations
        const hasApiKey = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY && process.env.REACT_APP_GOOGLE_DRIVE_API_KEY.trim() !== '';
        
        // Try direct Google Drive API if folder ID is configured
        if (images.length === 0) {
          let folderId = STORE_IMAGES_FOLDER_ID;
          
          // If master folder is configured, find the subfolder by name
          if (!folderId && MASTER_FOLDER_ID) {
            if (!hasApiKey) {
              setError('Google Drive API key is missing. Please set REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.');
            } else {
              try {
                folderId = await findSubfolderByName(MASTER_FOLDER_ID, STORE_IMAGES_SUBFOLDER_NAME);
              } catch (err) {
                if (err.message && err.message.includes('API key')) {
                  setError('Google Drive API key is missing or invalid. Please check REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.');
                } else {
                  console.error('Failed to find store images subfolder:', err);
                }
              }
            }
          }
          
          if (folderId) {
            if (!hasApiKey) {
              setError('Google Drive API key is missing. Please set REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.');
            } else {
              try {
                const driveImages = await fetchImagesFromGoogleDriveFolder(folderId);
                images = driveImages.map((image, index) => generateStoreImageFromGoogleDrive(image, index));
              } catch (err) {
                if (err.message && err.message.includes('API key')) {
                  setError('Google Drive API key is missing or invalid. Please check REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.');
                } else {
                  console.error('Failed to fetch store images from Google Drive:', err);
                  setError(err.message || 'Failed to load store images from Google Drive.');
                }
              }
            }
          }
        }

        // Use fetched images if available, otherwise use fallback
        if (images.length > 0) {
          setStoreImages(images);
        } else if (!MASTER_FOLDER_ID && !STORE_IMAGES_FOLDER_ID && !STORE_IMAGES_PROXY_URL) {
          // Only show fallback if no Google Drive config is provided
          setStoreImages(fallbackStoreImages);
        } else if (!error) {
          // Only set generic error if no specific error was set above
          const hasApiKey = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY && process.env.REACT_APP_GOOGLE_DRIVE_API_KEY.trim() !== '';
          const errorMsg = hasApiKey 
            ? 'No store images found. Please check your Google Drive configuration and ensure the folder is shared publicly.'
            : 'Google Drive API key is missing. Please set REACT_APP_GOOGLE_DRIVE_API_KEY in your .env file and restart the development server.';
          setError(errorMsg);
        }
      } catch (err) {
        console.error('Error loading store images:', err);
        setError(err.message);
        setStoreImages(fallbackStoreImages);
      } finally {
        setLoading(false);
      }
    };

    loadStoreImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // error is intentionally excluded - it's set within loadStoreImages

  return { storeImages, loading, error };
};

// Export store images for backward compatibility (will be populated after first load)
export let storeImages = fallbackStoreImages;

// Update storeImages when useStoreImages hook is used
// This is for components that don't use hooks
export const updateStoreImages = (images) => {
  storeImages = images;
};

// Slider Configuration
export const sliderConfig = {
  autoPlay: true,
  autoPlayInterval: 3000, // 3 seconds
  showDots: true,
  showNavigation: true,
  loop: true
};

// Instructions for managing store images:
/*
GOOGLE DRIVE SYSTEM: All store images are now stored in Google Drive

SETUP (Option 1 - Master Folder - Recommended):
1. Create a master Google Drive folder (e.g., "Holly Valley Images")
2. Create a subfolder named "Store Images" inside the master folder
3. Upload all store images to the "Store Images" subfolder
4. Share the master folder: Right-click → Share → "Anyone with the link can view"
5. Copy the master folder ID from URL: https://drive.google.com/drive/folders/FOLDER_ID
6. Set environment variable:
   REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID=YOUR_MASTER_FOLDER_ID

SETUP (Option 2 - Direct Folder ID):
1. Create a Google Drive folder for store images
2. Upload all store images to this folder
3. Share the folder: Right-click → Share → "Anyone with the link can view"
4. Copy the folder ID from the URL: https://drive.google.com/drive/folders/FOLDER_ID
5. Set environment variable:
   REACT_APP_STORE_IMAGES_FOLDER_ID=YOUR_FOLDER_ID

SETUP (Option 3 - Proxy URL):
   REACT_APP_STORE_IMAGES_PROXY_URL=/api/googledrive/images?folderId=YOUR_FOLDER_ID

To ADD a new image:
1. Upload the image to your Google Drive folder
2. Images are automatically fetched and displayed
3. Use numbered prefixes (01_, 02_, etc.) to control order

To REMOVE an image:
1. Delete the image from Google Drive folder
2. It will automatically be removed from the display

To REORDER images:
1. Rename files with numbers: 01_front.jpg, 02_left.jpg, etc.
2. Files are sorted alphabetically by name

RECOMMENDED NAMING CONVENTION:
- Use numbers for ordering: 01_, 02_, 03_, etc.
- Use descriptive names: 01_store_front.jpg, 02_inside_view.jpg
- Supported formats: JPG, JPEG, PNG, WebP
*/
