/**
 * Helper script to generate a JSON file with image URLs from OneDrive
 * 
 * Usage:
 *   node scripts/generateSignageImages.js <OneDriveShareLink> [outputFile]
 * 
 * Example:
 *   node scripts/generateSignageImages.js "https://1drv.ms/f/s!TOKEN" public/api/signage-images.json
 * 
 * This script requires the OneDrive link to be publicly shared.
 * It will create a JSON file with all image URLs that can be used
 * with the REACT_APP_ONEDRIVE_LINK environment variable.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const oneDriveLink = process.argv[2];
const outputFile = process.argv[3] || 'public/api/signage-images.json';

if (!oneDriveLink) {
  console.error('Error: OneDrive share link is required');
  console.log('\nUsage:');
  console.log('  node scripts/generateSignageImages.js <OneDriveShareLink> [outputFile]');
  console.log('\nExample:');
  console.log('  node scripts/generateSignageImages.js "https://1drv.ms/f/s!TOKEN" public/api/signage-images.json');
  process.exit(1);
}

function extractShareToken(link) {
  let shareToken = null;
  
  // Normalize the link
  link = link.trim().replace(/\/$/, '');
  
  // Handle 1drv.ms format
  if (link.includes('1drv.ms')) {
    // Try standard /s! format first
    const match = link.match(/[su]\/s!([A-Za-z0-9_-]+)/);
    if (match) {
      shareToken = match[1];
    } else {
      // Handle /f/c/ format - extract the IDs
      const folderMatch = link.match(/\/f\/c\/([A-Za-z0-9]+)\/([A-Za-z0-9_-]+)/);
      if (folderMatch) {
        // For /f/c/ format, we'll use the URL-encoded approach
        return null; // Signal that we need URL encoding
      } else {
        const altMatch = link.match(/1drv\.ms\/[fu]\/([A-Za-z0-9_-]+)/);
        if (altMatch) {
          shareToken = altMatch[1];
        }
      }
    }
  }
  // Handle onedrive.live.com format
  else if (link.includes('onedrive.live.com')) {
    try {
      const url = new URL(link);
      shareToken = url.searchParams.get('id') || url.searchParams.get('cid') || url.searchParams.get('resid');
      
      if (!shareToken) {
        const match = link.match(/[?&](?:id|cid|resid)=([^&]+)/);
        if (match) {
          shareToken = match[1];
        }
      }
    } catch (e) {
      const match = link.match(/[?&](?:id|cid|resid)=([^&]+)/);
      if (match) {
        shareToken = match[1];
      }
    }
  }
  
  return shareToken;
}

function fetchOneDriveFolder(shareToken) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://api.onedrive.com/v1.0/shares/${shareToken}/root/children`;
    
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
          // Try alternative API format
          const altApiUrl = `https://api.onedrive.com/v1.0/shares/u!${encodeURIComponent(shareToken)}/root/children`;
          https.get(altApiUrl, {
            headers: {
              'Accept': 'application/json',
            }
          }, (altRes) => {
            let altData = '';
            
            altRes.on('data', (chunk) => {
              altData += chunk;
            });
            
            altRes.on('end', () => {
              if (altRes.statusCode === 200) {
                try {
                  const json = JSON.parse(altData);
                  resolve(json);
                } catch (e) {
                  reject(new Error(`Failed to parse alternative response: ${e.message}`));
                }
              } else {
                reject(new Error(`OneDrive API returned status ${altRes.statusCode}: ${altData}`));
              }
            });
          }).on('error', (e) => {
            reject(new Error(`Failed to fetch from alternative API: ${e.message}`));
          });
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Failed to fetch from OneDrive API: ${e.message}`));
    });
  });
}

function fetchOneDriveFolderByUrl(encodedUrl) {
  return new Promise((resolve, reject) => {
    // Try OneDrive API with URL-encoded share link
    const apiUrl = `https://api.onedrive.com/v1.0/shares/${encodedUrl}/root/children`;
    
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
          reject(new Error(`OneDrive API returned status ${res.statusCode}: ${data.substring(0, 500)}`));
        }
      });
    }).on('error', (e) => {
      reject(new Error(`Failed to fetch from OneDrive API: ${e.message}`));
    });
  });
}

async function main() {
  console.log('Extracting share token from OneDrive link...');
  const shareToken = extractShareToken(oneDriveLink);
  
  // Check if this is a /f/c/ format link that needs URL encoding
  const isUrlFormat = oneDriveLink.includes('1drv.ms') && oneDriveLink.includes('/f/c/');
  
  if (!shareToken && !isUrlFormat) {
    console.error('Error: Could not extract share token from the provided link');
    console.error('Please ensure the link is in one of these formats:');
    console.error('  - https://1drv.ms/f/s!TOKEN');
    console.error('  - https://1drv.ms/f/c/ID1/ID2?e=CODE');
    console.error('  - https://onedrive.live.com/?id=TOKEN');
    process.exit(1);
  }
  
  if (isUrlFormat) {
    console.log('Detected /f/c/ format link - using URL-encoded approach');
  } else {
    console.log(`Share token extracted: ${shareToken}`);
  }
  
  console.log('Fetching folder contents from OneDrive API...');
  
  try {
    let folderData;
    if (isUrlFormat) {
      // For /f/c/ format, encode the entire URL
      const encodedUrl = Buffer.from(oneDriveLink).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      folderData = await fetchOneDriveFolderByUrl(encodedUrl);
    } else {
      folderData = await fetchOneDriveFolder(shareToken);
    }
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.JPG', '.JPEG', '.PNG'];
    const imageItems = (folderData.value || []).filter(item => {
      const name = item.name?.toLowerCase() || '';
      return imageExtensions.some(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
    });
    
    console.log(`Found ${imageItems.length} image(s) in folder`);
    
    if (imageItems.length === 0) {
      console.error('Error: No images found in the OneDrive folder');
      console.error('Please ensure the folder contains image files (jpg, png, gif, etc.)');
      process.exit(1);
    }
    
    // Extract direct download URLs
    const imageUrls = imageItems.map(item => {
      // Prefer direct download URL
      if (item['@content.downloadUrl']) {
        return item['@content.downloadUrl'];
      }
      if (item['@microsoft.graph.downloadUrl']) {
        return item['@microsoft.graph.downloadUrl'];
      }
      // Fallback to web URL
      return item.webUrl || '';
    }).filter(url => url && url.length > 0);
    
    if (imageUrls.length === 0) {
      console.error('Error: Could not extract image URLs from OneDrive response');
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
    console.log(`   REACT_APP_ONEDRIVE_LINK=/api/signage-images.json`);
    console.log(`   (or the full URL if hosting the JSON file elsewhere)`);
    console.log(`2. Rebuild your application: npm run build`);
    console.log(`\nImage URLs saved:`);
    imageUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Ensure the OneDrive folder is shared publicly with "Anyone with the link"');
    console.error('2. Verify the share link is correct');
    console.error('3. Check your internet connection');
    process.exit(1);
  }
}

main();

