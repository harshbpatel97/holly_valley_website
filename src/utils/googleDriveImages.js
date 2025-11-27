/**
 * Google Drive Image Utility
 * 
 * Fetches images from Google Drive folders and converts them to usable URLs
 * Supports both direct API calls and pre-generated JSON files
 */

const GOOGLE_DRIVE_API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY;

/**
 * List all subfolders in a parent Google Drive folder
 * @param {string} parentFolderId - Parent folder ID
 * @param {string} apiKey - Google Drive API key (optional if set in env)
 * @returns {Promise<Array>} Array of folder objects with {id, name}
 */
export const listSubfolders = async (parentFolderId, apiKey = null) => {
  if (!parentFolderId) {
    throw new Error('Parent folder ID is required');
  }

  const driveApiKey = apiKey || GOOGLE_DRIVE_API_KEY;
  if (!driveApiKey) {
    throw new Error('Google Drive API key is required. Set REACT_APP_GOOGLE_DRIVE_API_KEY or pass as parameter');
  }

  try {
    // Google Drive API v3 - List folders in parent
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${driveApiKey}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Failed to fetch subfolders: ${response.status}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching subfolders:', error);
    throw error;
  }
};

/**
 * Find a subfolder by name in a parent folder
 * @param {string} parentFolderId - Parent folder ID
 * @param {string} folderName - Name of the subfolder to find
 * @param {string} apiKey - Google Drive API key (optional if set in env)
 * @returns {Promise<string|null>} Subfolder ID or null if not found
 */
export const findSubfolderByName = async (parentFolderId, folderName, apiKey = null) => {
  try {
    const subfolders = await listSubfolders(parentFolderId, apiKey);
    const folder = subfolders.find(f => 
      f.name.toLowerCase().trim() === folderName.toLowerCase().trim()
    );
    return folder ? folder.id : null;
  } catch (error) {
    console.error(`Error finding subfolder "${folderName}":`, error);
    throw error;
  }
};

/**
 * Fetch images from a Google Drive folder
 * @param {string} folderId - Google Drive folder ID
 * @param {string} apiKey - Google Drive API key (optional if set in env)
 * @returns {Promise<Array>} Array of image objects with {id, name, url}
 */
export const fetchImagesFromGoogleDriveFolder = async (folderId, apiKey = null) => {
  if (!folderId) {
    throw new Error('Google Drive folder ID is required');
  }

  const driveApiKey = apiKey || GOOGLE_DRIVE_API_KEY;
  if (!driveApiKey) {
    throw new Error('Google Drive API key is required. Set REACT_APP_GOOGLE_DRIVE_API_KEY or pass as parameter');
  }

  try {
    // Google Drive API v3 - List files in folder
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,mimeType)&key=${driveApiKey}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Failed to fetch from Google Drive: ${response.status}`);
    }

    const data = await response.json();
    const imageFiles = data.files || [];

    if (imageFiles.length === 0) {
      return [];
    }

    // Convert to image URLs using Google Drive thumbnail API
    // Format: https://drive.google.com/thumbnail?id=FILE_ID&sz=w0 (original size)
    const images = imageFiles
      .filter(file => {
        const mimeType = file.mimeType?.toLowerCase() || '';
        return mimeType.startsWith('image/');
      })
      .map(file => ({
        id: file.id,
        name: file.name,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w0`
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name for consistent ordering

    return images;
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    throw error;
  }
};

/**
 * Fetch images from a Google Drive proxy API endpoint
 * @param {string} proxyUrl - URL to the proxy endpoint (e.g., /api/googledrive/images?folderId=xxx)
 * @returns {Promise<Array>} Array of image URLs
 */
export const fetchImagesFromGoogleDriveProxy = async (proxyUrl) => {
  try {
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Failed to fetch from proxy: ${response.status}`);
    }

    const data = await response.json();
    
    // Support both formats: {images: [...]} or [...]
    // Also handle format where each item is {id, name, url} object
    let imageUrls = [];
    if (Array.isArray(data)) {
      imageUrls = data.map(item => {
        // If item is an object with url property, extract it
        if (typeof item === 'object' && item.url) {
          return item.url;
        }
        // If item is an object with id, construct thumbnail URL
        if (typeof item === 'object' && item.id) {
          return `https://drive.google.com/thumbnail?id=${item.id}&sz=w0`;
        }
        // Otherwise assume it's a URL string
        return item;
      });
    } else if (data.images) {
      imageUrls = data.images.map(item => {
        if (typeof item === 'object' && item.url) return item.url;
        if (typeof item === 'object' && item.id) return `https://drive.google.com/thumbnail?id=${item.id}&sz=w0`;
        return item;
      });
    }

    // Normalize all URLs to thumbnail format (converts googleusercontent URLs to thumbnail format)
    return imageUrls
      .filter(url => url && typeof url === 'string')
      .map(url => normalizeGoogleDriveImageUrl(url));
  } catch (error) {
    console.error('Error fetching images from Google Drive proxy:', error);
    throw error;
  }
};

/**
 * Convert Google Drive image URL to thumbnail format that works reliably
 * Handles different Google Drive URL formats and converts to thumbnail API format
 * @param {string} imageUrl - Google Drive image URL
 * @returns {string} Normalized thumbnail URL
 */
export const normalizeGoogleDriveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If already a thumbnail URL, ensure it's in the correct format
  if (imageUrl.includes('drive.google.com/thumbnail')) {
    // Remove any query params that might cause issues (like authuser=0)
    const urlObj = new URL(imageUrl);
    // Keep only id and sz params, remove others
    return `https://drive.google.com/thumbnail?id=${urlObj.searchParams.get('id')}&sz=w0`;
  }
  
  let fileId = null;
  
  // Try to extract file ID from various formats:
  
  // 1. googleusercontent.com/d/FILE_ID format
  // Example: https://lh3.googleusercontent.com/d/1eddFlAvIn7PIKVXFb71cdlq__0w-tr8Q=w0?authuser=0
  // The file ID is everything after /d/ until =, ?, &, or end of string
  // File IDs can contain: letters, numbers, underscores, hyphens
  const dMatch = imageUrl.match(/googleusercontent\.com\/d\/([^=?&]+)/);
  if (dMatch) {
    fileId = dMatch[1];
  }
  
  // 2. drive.google.com/file/d/FILE_ID or /uc?id=FILE_ID format
  if (!fileId) {
    const fileMatch = imageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
  }
  
  // 3. URL with ?id= or &id= parameter
  if (!fileId) {
    const idMatch = imageUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      fileId = idMatch[1];
    }
  }
  
  // 4. If image object has id property, use it directly (for cases where URL doesn't contain ID)
  // This will be handled by the caller if they pass the file ID separately
  
  if (fileId) {
    // Always use thumbnail format - this is more reliable and less prone to 429 errors
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w0`;
  }
  
  // If we can't extract file ID, return original (might already be a valid URL)
  console.warn('Could not extract file ID from URL:', imageUrl);
  return imageUrl;
};

/**
 * Generate product properties from Google Drive image
 * @param {Object} image - Image object with {id, name, url}
 * @param {string} category - Category name for ID generation
 * @returns {Object} Product object with {id, src, alt, caption}
 */
export const generateProductFromGoogleDriveImage = (image, category = '') => {
  const nameWithoutExtension = image.name.replace(/\.[^/.]+$/, ""); // Remove file extension
  
  // Remove numbered prefix if present (e.g., "01 - Bread.jpg" -> "Bread.jpg")
  const cleanName = nameWithoutExtension.replace(/^\d+\s*-\s*/, "");
  
  const id = `${category}-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const src = normalizeGoogleDriveImageUrl(image.url);
  const alt = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const caption = cleanName;
  
  return { id, src, alt, caption };
};

/**
 * Generate store image properties from Google Drive image
 * @param {Object} image - Image object with {id, name, url}
 * @param {number} index - Index for ID generation
 * @returns {Object} Store image object with {id, src, alt, title, description}
 */
export const generateStoreImageFromGoogleDrive = (image, index) => {
  const nameWithoutExtension = image.name.replace(/\.[^/.]+$/, "");
  const cleanName = nameWithoutExtension.replace(/^\d+\s*[-_]*\s*/, ""); // Remove numbered prefix
  
  // Generate ID from filename
  const id = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const src = normalizeGoogleDriveImageUrl(image.url);
  const title = cleanName.replace(/[-_]/g, ' ');
  const alt = title;
  const description = `${title} of Holly Valley store`;
  
  return { id, src, alt, title, description };
};

