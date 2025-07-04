// Utility function to handle image paths for both development and GitHub Pages
export const getImagePath = (imagePath) => {
  // If we're in development (localhost), use the path as-is
  if (process.env.NODE_ENV === 'development') {
    return imagePath;
  }
  
  // For production (GitHub Pages), we need to handle the base path
  // The homepage is set to https://harshbpatel97.github.io/holly_valley_website
  // So we need to ensure the path is correct
  
  // If the path already starts with the full URL, return as-is
  if (imagePath.startsWith('https://harshbpatel97.github.io/holly_valley_website')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /, make it work with the repository name
  if (imagePath.startsWith('/')) {
    return `/holly_valley_website${imagePath}`;
  }
  
  // Otherwise, return as-is
  return imagePath;
};

// Helper function to get the base URL for images
export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  return '/holly_valley_website';
}; 