/**
 * Script to verify Google Drive folder and file sharing permissions
 * 
 * Usage:
 *   node scripts/verifyGoogleDriveSharing.js <GoogleDriveFolderId> [apiKey]
 * 
 * This script checks if:
 * 1. The folder is publicly shared
 * 2. The image files are publicly accessible
 * 3. The URLs generated will work
 */

const https = require('https');

const folderId = process.argv[2];
const apiKey = process.argv[3] || process.env.GOOGLE_DRIVE_API_KEY;

if (!folderId) {
  console.error('Error: Google Drive folder ID is required');
  console.log('\nUsage:');
  console.log('  node scripts/verifyGoogleDriveSharing.js <FolderID> [apiKey]');
  process.exit(1);
}

if (!apiKey) {
  console.error('Error: Google Drive API key is required');
  console.log('\nTo get an API key:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Enable "Drive API"');
  console.log('3. Create API Key in Credentials');
  process.exit(1);
}

function checkFilePermissions(fileId, apiKey) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink,permissions,shared&key=${apiKey}`;
    
    https.get(apiUrl, {
      headers: { 'Accept': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`API returned ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function fetchFolderContents(folderId, apiKey) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image'&fields=files(id,name,mimeType)&key=${apiKey}`;
    
    https.get(apiUrl, {
      headers: { 'Accept': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`API returned ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Checking Google Drive folder sharing...\n');
    
    // Check folder permissions
    console.log('1. Checking folder permissions...');
    try {
      const folderInfo = await checkFilePermissions(folderId, apiKey);
      console.log(`   Folder: ${folderInfo.name || folderId}`);
      console.log(`   Shared: ${folderInfo.shared ? 'Yes' : 'No'}`);
      
      if (!folderInfo.shared) {
        console.log('\n   ⚠️  WARNING: Folder is NOT shared publicly!');
        console.log('   To fix:');
        console.log('   1. Open folder in Google Drive');
        console.log('   2. Click "Share" button');
        console.log('   3. Change to "Anyone with the link" → Viewer');
        console.log('   4. Click "Done"\n');
      } else {
        console.log('   ✓ Folder is shared\n');
      }
    } catch (error) {
      console.error(`   ✗ Error checking folder: ${error.message}\n`);
    }
    
    // Check individual files
    console.log('2. Checking image files...');
    const folderData = await fetchFolderContents(folderId, apiKey);
    const imageFiles = folderData.files || [];
    
    if (imageFiles.length === 0) {
      console.log('   No images found in folder');
      return;
    }
    
    console.log(`   Found ${imageFiles.length} image file(s)\n`);
    
    let allShared = true;
    let sharedCount = 0;
    
    for (const file of imageFiles) {
      try {
        const fileInfo = await checkFilePermissions(file.id, apiKey);
        const isShared = fileInfo.shared || false;
        
        // Check if there's a public permission
        const hasPublicPermission = fileInfo.permissions?.some(
          p => p.type === 'anyone' && p.role !== undefined
        ) || false;
        
        if (isShared || hasPublicPermission) {
          sharedCount++;
          console.log(`   ✓ ${file.name} - Shared publicly`);
        } else {
          allShared = false;
          console.log(`   ✗ ${file.name} - NOT shared publicly`);
          console.log(`     Fix: Share file → "Anyone with the link" → Viewer`);
        }
      } catch (error) {
        console.log(`   ✗ ${file.name} - Error: ${error.message}`);
        allShared = false;
      }
    }
    
    console.log(`\n3. Summary:`);
    console.log(`   Shared files: ${sharedCount}/${imageFiles.length}`);
    
    if (allShared && sharedCount === imageFiles.length) {
      console.log(`   ✓ All files are publicly shared!`);
      console.log(`\n   Next steps:`);
      console.log(`   1. Run: npm run generate-signage-images-gdrive`);
      console.log(`   2. Images should load correctly now\n`);
    } else {
      console.log(`   ⚠️  Some files are NOT publicly shared`);
      console.log(`\n   To fix sharing:`);
      console.log(`   1. Open Google Drive in your browser`);
      console.log(`   2. Select all images in the folder`);
      console.log(`   3. Right-click → Share → "Change to anyone with the link"`);
      console.log(`   4. Set permission to "Viewer"`);
      console.log(`   5. Click "Done"`);
      console.log(`   6. Run this script again to verify\n`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

