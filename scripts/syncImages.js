#!/usr/bin/env node

/**
 * Script to sync images between src/assets/images and public/images
 * This ensures the dynamic require.context system works while keeping public images available
 * Run this script when adding/removing images: npm run sync-images
 */

const fs = require('fs');
const path = require('path');

function syncImages() {
  console.log('🔄 Syncing images between src/assets and public directories...');
  
  const categories = ['groceries', 'soft-drinks'];
  
  categories.forEach(category => {
    const srcDir = path.join(__dirname, '../src/assets/images', category);
    const publicDir = path.join(__dirname, '../public/images', category);
    
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy from src/assets to public
    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir);
      
      files.forEach(file => {
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
          const srcFile = path.join(srcDir, file);
          const publicFile = path.join(publicDir, file);
          
          // Copy file if it doesn't exist or is different
          if (!fs.existsSync(publicFile) || 
              fs.statSync(srcFile).mtime > fs.statSync(publicFile).mtime) {
            fs.copyFileSync(srcFile, publicFile);
            console.log(`✅ Copied: ${category}/${file}`);
          }
        }
      });
    }
  });
  
  console.log('🎉 Image sync complete!');
}

// Run the script if called directly
if (require.main === module) {
  syncImages();
}

module.exports = { syncImages }; 