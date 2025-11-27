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
    const imageUrls = Array.isArray(data) 
      ? data 
      : (data.images || []);

    return imageUrls.filter(url => url && typeof url === 'string');
  } catch (error) {
    console.error('Error fetching images from Google Drive proxy:', error);
    throw error;
  }
};

/**
 * Convert Google Drive image URL to a format that works reliably
 * Handles different Google Drive URL formats
 * @param {string} imageUrl - Google Drive image URL
 * @returns {string} Normalized image URL
 */
export const normalizeGoogleDriveImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If already a thumbnail URL, return as is
  if (imageUrl.includes('drive.google.com/thumbnail')) {
    return imageUrl;
  }
  
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = imageUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w0`;
  }
  
  // If URL contains /d/ format: lh3.googleusercontent.com/d/FILE_ID
  const dMatch = imageUrl.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch) {
    const fileId = dMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w0`;
  }
  
  // Return original if no pattern matches
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

