/**
 * Generate image lists from Google Drive folders for all categories
 * 
 * Usage:
 *   node scripts/generateAllImagesFromGoogleDrive.js
 * 
 * This script reads environment variables or a config file to generate
 * JSON files for all image categories (store, products, signage)
 * 
 * Environment variables:
 *   REACT_APP_GOOGLE_DRIVE_API_KEY or GOOGLE_DRIVE_API_KEY - Google Drive API key (required)
 *   
 *   Option 1 (Recommended - Master Folder):
 *   REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID or GOOGLE_DRIVE_MASTER_FOLDER_ID - Master folder containing all subfolders
 *   
 *   Option 2 (Individual Folders):
 *   GOOGLE_DRIVE_STORE_FOLDER_ID or REACT_APP_STORE_IMAGES_FOLDER_ID - Store images folder ID
 *   GOOGLE_DRIVE_GROCERIES_FOLDER_ID or REACT_APP_GROCERIES_FOLDER_ID - Groceries folder ID
 *   GOOGLE_DRIVE_SOFT_DRINKS_FOLDER_ID or REACT_APP_SOFT_DRINKS_FOLDER_ID - Soft drinks folder ID
 *   GOOGLE_DRIVE_ICE_BAGS_FOLDER_ID or REACT_APP_ICE_BAGS_FOLDER_ID - Ice bags folder ID
 *   GOOGLE_DRIVE_FROZEN_PIZZA_FOLDER_ID or REACT_APP_FROZEN_PIZZA_FOLDER_ID - Frozen pizza folder ID
 *   GOOGLE_DRIVE_FIREWOOD_FOLDER_ID or REACT_APP_FIREWOOD_FOLDER_ID - Firewood folder ID
 *   GOOGLE_DRIVE_ICE_CREAM_FOLDER_ID or REACT_APP_ICE_CREAM_FOLDER_ID - Ice cream folder ID
 *   GOOGLE_DRIVE_SIGNAGE_FOLDER_ID - Signage images folder ID
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists
try {
  if (fs.existsSync('.env')) {
    require('dotenv').config();
  }
} catch (e) {
  // dotenv not available, continue without it - use environment variables directly
}

// Check for API key in both React app format and script format
const apiKey = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || process.env.GOOGLE_DRIVE_API_KEY;

if (!apiKey) {
  console.error('Error: Google Drive API key environment variable is required');
  console.log('\nTo get an API key:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a project or select existing');
  console.log('3. Enable "Drive API"');
  console.log('4. Go to "Credentials" → Create API Key');
  console.log('\nSet one of these in your .env file:');
  console.log('  REACT_APP_GOOGLE_DRIVE_API_KEY=your-api-key (recommended for React apps)');
  console.log('  OR');
  console.log('  GOOGLE_DRIVE_API_KEY=your-api-key (alternative)');
  process.exit(1);
}

// Master folder ID (recommended approach)
const MASTER_FOLDER_ID = process.env.REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID || process.env.GOOGLE_DRIVE_MASTER_FOLDER_ID;

// Folder configuration - supports both master folder and individual folder IDs
const folderConfig = {
  store: {
    folderId: process.env.GOOGLE_DRIVE_STORE_FOLDER_ID || process.env.REACT_APP_STORE_IMAGES_FOLDER_ID,
    subfolderName: 'Store Images', // Name when using master folder
    outputFile: 'public/api/store-images.json',
    category: 'Store Images'
  },
  groceries: {
    folderId: process.env.GOOGLE_DRIVE_GROCERIES_FOLDER_ID || process.env.REACT_APP_GROCERIES_FOLDER_ID,
    subfolderName: 'Groceries',
    outputFile: 'public/api/groceries-images.json',
    category: 'Groceries'
  },
  softdrinks: {
    folderId: process.env.GOOGLE_DRIVE_SOFT_DRINKS_FOLDER_ID || process.env.REACT_APP_SOFT_DRINKS_FOLDER_ID,
    subfolderName: 'Soft Drinks',
    outputFile: 'public/api/soft-drinks-images.json',
    category: 'Soft Drinks'
  },
  icebags: {
    folderId: process.env.GOOGLE_DRIVE_ICE_BAGS_FOLDER_ID || process.env.REACT_APP_ICE_BAGS_FOLDER_ID,
    subfolderName: 'Ice Bags',
    outputFile: 'public/api/ice-bags-images.json',
    category: 'Ice Bags'
  },
  frozenpizza: {
    folderId: process.env.GOOGLE_DRIVE_FROZEN_PIZZA_FOLDER_ID || process.env.REACT_APP_FROZEN_PIZZA_FOLDER_ID,
    subfolderName: 'Frozen Pizza',
    outputFile: 'public/api/frozen-pizza-images.json',
    category: 'Frozen Pizza'
  },
  firewood: {
    folderId: process.env.GOOGLE_DRIVE_FIREWOOD_FOLDER_ID || process.env.REACT_APP_FIREWOOD_FOLDER_ID,
    subfolderName: 'Firewood',
    outputFile: 'public/api/firewood-images.json',
    category: 'Firewood'
  },
  icecream: {
    folderId: process.env.GOOGLE_DRIVE_ICE_CREAM_FOLDER_ID || process.env.REACT_APP_ICE_CREAM_FOLDER_ID,
    subfolderName: 'Ice Cream',
    outputFile: 'public/api/ice-cream-images.json',
    category: 'Ice Cream'
  },
  signage: {
    folderId: process.env.GOOGLE_DRIVE_SIGNAGE_FOLDER_ID || process.env.REACT_APP_SIGNAGE_FOLDER_ID,
    subfolderName: 'Signage',
    outputFile: 'public/api/signage-images.json',
    category: 'Signage'
  }
};

/**
 * List all subfolders in a parent Google Drive folder
 */
function listSubfolders(parentFolderId, apiKey) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${parentFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${apiKey}`;
    
    https.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json.files || []);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Google Drive API returned status ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Failed to fetch from Google Drive API: ${e.message}`));
    });
  });
}

/**
 * Find a subfolder by name in a parent folder
 */
async function findSubfolderByName(parentFolderId, folderName, apiKey) {
  try {
    const subfolders = await listSubfolders(parentFolderId, apiKey);
    const folder = subfolders.find(f => 
      f.name.toLowerCase().trim() === folderName.toLowerCase().trim()
    );
    return folder ? folder.id : null;
  } catch (error) {
    throw new Error(`Error finding subfolder "${folderName}": ${error.message}`);
  }
}

function fetchGoogleDriveFolder(folderId, apiKey) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,mimeType)&key=${apiKey}`;
    
    https.get(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`Google Drive API returned status ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Failed to fetch from Google Drive API: ${e.message}`));
    });
  });
}

async function generateImageList(category, config) {
  let folderId = config.folderId;
  
  // If master folder is configured, prioritize finding subfolder by name
  // This allows master folder to override individual folder IDs
  if (MASTER_FOLDER_ID && config.subfolderName) {
    try {
      console.log(`   Looking for subfolder "${config.subfolderName}" in master folder...`);
      const subfolderId = await findSubfolderByName(MASTER_FOLDER_ID, config.subfolderName, apiKey);
      if (subfolderId) {
        console.log(`   ✓ Found subfolder: ${config.subfolderName}`);
        folderId = subfolderId; // Use subfolder from master folder (overrides direct folder ID)
      } else {
        console.log(`   ⚠️  Subfolder "${config.subfolderName}" not found in master folder`);
        if (!folderId) {
          console.log(`   ⏭️  Skipping ${config.category} (subfolder not found and no direct folder ID)`);
          return;
        }
        console.log(`   Using direct folder ID as fallback`);
      }
    } catch (err) {
      console.log(`   ⚠️  Error finding subfolder: ${err.message}`);
      if (!folderId) {
        console.log(`   ⏭️  Skipping ${config.category} (error finding subfolder and no direct folder ID)`);
        return;
      }
      console.log(`   Using direct folder ID as fallback`);
    }
  } else if (!folderId) {
    // No master folder and no direct folder ID
    console.log(`⏭️  Skipping ${config.category} (no folder ID configured)`);
    return;
  }

  try {
    console.log(`\n📁 Fetching ${config.category}...`);
    const folderData = await fetchGoogleDriveFolder(folderId, apiKey);
    const imageFiles = folderData.files || [];
    
    if (imageFiles.length === 0) {
      console.log(`⚠️  No images found in ${config.category} folder`);
      return;
    }
    
    console.log(`   Found ${imageFiles.length} image(s)`);
    
    // Generate image URLs using thumbnail API
    const imageUrls = imageFiles
      .filter(file => {
        const mimeType = file.mimeType?.toLowerCase() || '';
        return mimeType.startsWith('image/');
      })
      .map(file => ({
        id: file.id,
        name: file.name,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w0`
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(config.outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write JSON file
    const jsonContent = JSON.stringify(imageUrls, null, 2);
    fs.writeFileSync(config.outputFile, jsonContent, 'utf8');
    
    console.log(`   ✓ Generated ${config.outputFile}`);
  } catch (error) {
    console.error(`   ❌ Error processing ${config.category}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Generating image lists from Google Drive...\n');
  
  if (MASTER_FOLDER_ID) {
    console.log(`📁 Using master folder: ${MASTER_FOLDER_ID}`);
    console.log('   The script will automatically find subfolders by name.\n');
  } else {
    console.log('📁 Using individual folder IDs (if configured)\n');
  }
  
  // Process all categories
  for (const [category, config] of Object.entries(folderConfig)) {
    await generateImageList(category, config);
  }
  
  console.log('\n✅ Done! Image lists generated.');
  console.log('\nNext steps:');
  if (MASTER_FOLDER_ID) {
    console.log(`1. Master folder is configured: ${MASTER_FOLDER_ID}`);
    console.log('2. Ensure all subfolders exist with correct names in the master folder');
  } else {
    console.log('1. Update your .env file with folder IDs if not already set');
    console.log('   OR set REACT_APP_GOOGLE_DRIVE_MASTER_FOLDER_ID to use master folder approach');
  }
  console.log('3. Rebuild your application: npm run build');
  console.log('4. Images will be fetched from Google Drive automatically');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

