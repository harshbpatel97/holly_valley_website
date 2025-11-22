/**
 * Helper script to generate a JSON file with image URLs from Google Drive
 * 
 * Usage:
 *   node scripts/generateSignageImagesGoogleDrive.js <GoogleDriveFolderId> [outputFile] [apiKey]
 * 
 * Example:
 *   node scripts/generateSignageImagesGoogleDrive.js "FOLDER_ID" public/api/signage-images.json "YOUR_API_KEY"
 * 
 * To get Google Drive API Key:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable "Drive API"
 * 4. Go to "Credentials" → "Create Credentials" → "API Key"
 * 5. Copy the API key
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const folderId = process.argv[2];
const outputFile = process.argv[3] || 'public/api/signage-images.json';
const apiKey = process.argv[4] || process.env.GOOGLE_DRIVE_API_KEY;

if (!folderId) {
  console.error('Error: Google Drive folder ID is required');
  console.log('\nUsage:');
  console.log('  node scripts/generateSignageImagesGoogleDrive.js <FolderID> [outputFile] [apiKey]');
  console.log('\nExample:');
  console.log('  node scripts/generateSignageImagesGoogleDrive.js "1ABC..." public/api/signage-images.json "YOUR_API_KEY"');
  console.log('\nOr set GOOGLE_DRIVE_API_KEY environment variable');
  process.exit(1);
}

if (!apiKey) {
  console.error('Error: Google Drive API key is required');
  console.log('\nTo get an API key:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a project or select existing');
  console.log('3. Enable "Drive API"');
  console.log('4. Go to "Credentials" → Create API Key');
  console.log('5. Pass it as argument or set GOOGLE_DRIVE_API_KEY env var');
  process.exit(1);
}

function fetchGoogleDriveFolder(folderId, apiKey) {
  return new Promise((resolve, reject) => {
    // Google Drive API v3 - List files in folder
    // Request file IDs only - we'll use permanent export=view URLs (don't expire like CDN URLs)
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,mimeType,size)&key=${apiKey}`;
    
    console.log('Fetching images from Google Drive...');
    
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

async function main() {
  try {
    const folderData = await fetchGoogleDriveFolder(folderId, apiKey);
    
    const imageFiles = folderData.files || [];
    
    console.log(`Found ${imageFiles.length} image(s) in folder`);
    
    if (imageFiles.length === 0) {
      console.error('Error: No images found in the Google Drive folder');
      console.error('Please ensure:');
      console.error('1. The folder contains image files (jpg, png, gif, etc.)');
      console.error('2. The folder is shared publicly (Anyone with the link can view)');
      console.error('3. The API key has Drive API enabled');
      process.exit(1);
    }
    
    // Extract direct download URLs that work publicly
    // Priority: webContentLink (most reliable) > direct view URL > thumbnailLink
    const imageUrls = imageFiles
      .filter(file => {
        // Ensure it's an image
        const mimeType = file.mimeType?.toLowerCase() || '';
        return mimeType.startsWith('image/');
      })
      .map(file => {
        // Use file ID with export=view format (most permanent, doesn't expire)
        // This format works when files are publicly shared and doesn't use temporary tokens
        // Format: https://drive.google.com/uc?export=view&id=FILE_ID
        const viewUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
        console.log(`  Generated permanent view URL for: ${file.name}`);
        return viewUrl;
      })
      .filter(url => url && url.length > 0);
    
    if (imageUrls.length === 0) {
      console.error('Error: Could not extract image URLs from Google Drive response');
      process.exit(1);
    }
    
    console.log(`Extracted ${imageUrls.length} image URL(s)`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }
    
    // Write JSON file
    const jsonContent = JSON.stringify(imageUrls, null, 2);
    fs.writeFileSync(outputFile, jsonContent, 'utf8');
    
    console.log(`\n✓ Successfully generated ${outputFile}`);
    console.log(`\nNext steps:`);
    console.log(`1. Update your .env file:`);
    console.log(`   REACT_APP_SIGNAGE_IMG_REF_LINK=/api/signage-images.json`);
    console.log(`2. Rebuild your application: npm run build`);
    console.log(`\nImage URLs saved:`);
    imageUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url.substring(0, 80)}...`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure the Google Drive folder is shared publicly');
    console.error('2. Verify the folder ID is correct');
    console.error('3. Check that your API key has Drive API enabled');
    console.error('4. Verify your internet connection');
    process.exit(1);
  }
}

main();

