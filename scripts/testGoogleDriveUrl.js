/**
 * Test script to check which Google Drive URL format works for a specific file
 * 
 * Usage:
 *   node scripts/testGoogleDriveUrl.js <FILE_ID>
 * 
 * This will test multiple URL formats and tell you which one works
 */

const https = require('https');

const fileId = process.argv[2];

if (!fileId) {
  console.error('Error: File ID is required');
  console.log('\nUsage:');
  console.log('  node scripts/testGoogleDriveUrl.js <FILE_ID>');
  console.log('\nTo get FILE_ID:');
  console.log('  1. Open file in Google Drive');
  console.log('  2. URL format: https://drive.google.com/file/d/FILE_ID/view');
  console.log('  3. Copy the FILE_ID part');
  process.exit(1);
}

const urlFormats = [
  {
    name: 'Thumbnail API (w0 = original size)',
    url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w0`
  },
  {
    name: 'Thumbnail API (w1920 = full HD)',
    url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`
  },
  {
    name: 'Export View',
    url: `https://drive.google.com/uc?export=view&id=${fileId}`
  },
  {
    name: 'Export Download',
    url: `https://drive.google.com/uc?export=download&id=${fileId}`
  },
  {
    name: 'UC without export',
    url: `https://drive.google.com/uc?id=${fileId}`
  }
];

function testUrl(format) {
  return new Promise((resolve) => {
    const url = new URL(format.url);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)',
        'Referer': 'https://drive.google.com/'
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      const status = res.statusCode;
      const location = res.headers.location || '';
      const contentType = res.headers['content-type'] || '';
      
      resolve({
        format: format.name,
        url: format.url,
        status: status,
        success: status === 200 || (status >= 300 && status < 400 && location),
        redirect: status >= 300 && status < 400 ? location : null,
        contentType: contentType
      });
    });

    req.on('error', (e) => {
      resolve({
        format: format.name,
        url: format.url,
        status: 'ERROR',
        success: false,
        error: e.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        format: format.name,
        url: format.url,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function main() {
  console.log(`Testing Google Drive URL formats for file ID: ${fileId}\n`);
  console.log('Testing multiple URL formats...\n');

  const results = [];

  for (const format of urlFormats) {
    const result = await testUrl(format);
    results.push(result);
    
    if (result.success) {
      console.log(`✓ ${result.format}`);
      console.log(`  URL: ${result.url}`);
      console.log(`  Status: ${result.status}`);
      if (result.redirect) {
        console.log(`  Redirects to: ${result.redirect.substring(0, 80)}...`);
      }
      if (result.contentType) {
        console.log(`  Content-Type: ${result.contentType}`);
      }
      console.log('');
    } else {
      console.log(`✗ ${result.format}`);
      console.log(`  URL: ${result.url}`);
      console.log(`  Status: ${result.status}${result.error ? ` (${result.error})` : ''}`);
      console.log('');
    }
  }

  // Summary
  const workingFormats = results.filter(r => r.success);
  
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  if (workingFormats.length === 0) {
    console.log('\n❌ NONE of the URL formats work for this file!\n');
    console.log('This likely means:');
    console.log('  1. The file is NOT publicly shared');
    console.log('  2. The file ID is incorrect');
    console.log('  3. The file has restricted access\n');
    console.log('To fix:');
    console.log('  1. Right-click the file in Google Drive');
    console.log('  2. Click "Share"');
    console.log('  3. Change to "Anyone with the link" → Viewer');
    console.log('  4. Click "Done"');
    console.log('  5. Run this test again\n');
  } else {
    console.log(`\n✅ Found ${workingFormats.length} working URL format(s):\n`);
    workingFormats.forEach((result, index) => {
      console.log(`${index + 1}. ${result.format}`);
      console.log(`   ${result.url}\n`);
    });
    
    // Recommend the best format
    const recommended = workingFormats.find(r => r.format.includes('Thumbnail')) || workingFormats[0];
    console.log(`💡 RECOMMENDED FORMAT: ${recommended.format}`);
    console.log(`   ${recommended.url}\n`);
  }
}

main().catch(console.error);

