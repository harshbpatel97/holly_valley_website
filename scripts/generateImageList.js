const fs = require('fs');
const path = require('path');

// Function to read directory and get image files
function getImageFiles(directoryPath) {
  try {
    if (!fs.existsSync(directoryPath)) {
      console.warn(`Directory does not exist: ${directoryPath}`);
      return [];
    }
    
    const files = fs.readdirSync(directoryPath);
    
    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      })
      .sort();
    
    return imageFiles;
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error);
    return [];
  }
}

// Function to generate the JSON file
function generateImageList() {
  const baseDir = path.join(__dirname, '..', 'public', 'images');
  const outputPath = path.join(__dirname, '..', 'public', 'api', 'images.json');
  
  console.log('Scanning image directories...');
  
  // Read images from each category directory
  const imageList = {};
  
  // Groceries
  const groceriesPath = path.join(baseDir, 'groceries');
  imageList.groceries = getImageFiles(groceriesPath);
  console.log(`Found ${imageList.groceries.length} grocery images`);
  
  // Soft drinks
  const softDrinksPath = path.join(baseDir, 'soft-drinks');
  imageList['soft-drinks'] = getImageFiles(softDrinksPath);
  console.log(`Found ${imageList['soft-drinks'].length} soft drink images`);
  
  // Ensure the api directory exists
  const apiDir = path.dirname(outputPath);
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Write the JSON file
  try {
    fs.writeFileSync(outputPath, JSON.stringify(imageList, null, 2));
    console.log(`✅ Image list generated successfully: ${outputPath}`);
    console.log('📊 Summary:');
    console.log(`   Groceries: ${imageList.groceries.length} images`);
    console.log(`   Soft Drinks: ${imageList['soft-drinks'].length} images`);
  } catch (error) {
    console.error('❌ Error writing JSON file:', error);
  }
}

// Run the script
if (require.main === module) {
  generateImageList();
}

module.exports = { generateImageList }; 