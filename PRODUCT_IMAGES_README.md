# Product Images Management Guide

This guide explains how to easily add, remove, and manage product images on the Holly Valley website using the dynamic system with src/assets.

## 📁 File Structure
- **Configuration**: `src/config/productImages.js` (dynamic configuration)
- **Source Images**: `src/assets/images/` (for require.context)
- **Public Images**: `public/images/` (for web serving)
- **Sync Script**: `scripts/syncImages.js` (keeps directories in sync)

## 🎯 Dynamic System with src/assets

The system uses webpack's `require.context` to dynamically read image files from `src/assets/images` directories at runtime, while keeping `public/images` synchronized for web serving.

### How It Works:
1. **Dynamic Detection**: `require.context` reads from `src/assets/images/` at runtime
2. **Web Serving**: Images are served from `public/images/` via web paths
3. **Auto Sync**: Script keeps both directories synchronized
4. **Filename = Caption**: "Coca Cola.jpg" displays as "Coca Cola"

## 🖼️ How to Add a New Product

### Step 1: Add the Product Image
1. Place your product image in the appropriate directory:
   - **Groceries**: `src/assets/images/groceries/`
   - **Soft Drinks**: `src/assets/images/soft-drinks/`
2. **Name the file exactly as you want it to appear as the caption**
   - Example: `New Snack Brand.jpg` will display as "New Snack Brand"
   - Example: `Energy Drink.jpg` will display as "Energy Drink"
3. Supported formats: JPG, JPEG, PNG, WebP, GIF
4. Recommended size: 150px × 150px (or similar aspect ratio)

### Step 2: Sync Images (Optional)
1. Run the sync script to copy to public directory:
   ```bash
   npm run sync-images
   ```
2. **Note**: This happens automatically before build

### Step 3: Done!
- **No configuration changes needed**
- **System automatically detects and includes the new image**
- **Images are automatically synced during build**

### Example - Adding New Grocery Item:
1. Add `New Snack Brand.jpg` to `src/assets/images/groceries/`
2. **That's it!** System automatically:
   - Detects the new file
   - Generates: `id: 'new-snack-brand'`
   - Generates: `src: '/images/groceries/New Snack Brand.jpg'`
   - Generates: `alt: 'new-snack-brand'`
   - Displays: `caption: 'New Snack Brand'`

### Example - Adding New Soft Drink:
1. Add `Energy Drink.jpg` to `src/assets/images/soft-drinks/`
2. **That's it!** System automatically includes it

## ❌ How to Remove a Product

### Step 1: Delete the Image File
1. Delete the image file from the appropriate directory:
   - **Groceries**: `src/assets/images/groceries/`
   - **Soft Drinks**: `src/assets/images/soft-drinks/`
2. Example: Remove `New Snack Brand.jpg` from `src/assets/images/groceries/`

### Step 2: Done!
- **No configuration changes needed**
- **System automatically removes it from display**
- **Public directory will be cleaned up on next sync**

## 🔄 How to Reorder Products

1. **Rename files with numbered prefixes**:
   - `01 - Bread.jpg`
   - `02 - Cheetos.jpg`
   - `03 - New Product.jpg`
2. **System automatically sorts them alphabetically**
3. **Files without prefixes appear first**

## 📋 Current Product Structure

### Groceries Category (16 items):
```
src/assets/images/groceries/
├── Bread.jpg                    # Bread
├── Cheetos.jpg                  # Cheetos
├── Chocolates.jpg               # Chocolates
├── Chewing-Gums.jpg             # Chewing-Gums
├── Skittles.jpg                 # Skittles
├── Rice Krispies Treats.jpg     # Rice Krispies Treats
├── Cleaning Sprays.jpg          # Cleaning Sprays
├── Dawn Liquid Wash.jpg         # Dawn Liquid Wash
├── Lays.jpg                     # Lays
├── Dial Handwash.jpg            # Dial Handwash
├── Dog Products.jpg             # Dog Products
├── Doritos.jpg                  # Doritos
├── Dove Products.jpg            # Dove Products
├── Eggs.jpg                     # Eggs
├── Dairy Products.jpg           # Dairy Products
└── Funyuns.jpg                  # Funyuns
```

### Soft Drinks Category (12 items):
```
src/assets/images/soft-drinks/
├── Coca Cola.jpg                # Coca Cola
├── Pepsi.jpg                    # Pepsi
├── Sprite.jpg                   # Sprite
├── Fanta.jpg                    # Fanta
├── Dr Pepper.jpg                # Dr Pepper
├── Canada Dry.jpg               # Canada Dry
├── Brisk Tea.jpg                # Brisk Tea
└── Starbucks.jpg                # Starbucks
```

## 🎯 Recommended Naming Conventions

### Image Files:
- **Use proper case for display** (e.g., `New Snack Brand.jpg`, `Energy Drink.jpg`)
- **Be descriptive and user-friendly**
- **The filename will be the exact caption shown to users**
- **Avoid special characters except spaces and hyphens**

### For Ordering:
- **Use numbered prefixes**: `01 - Bread.jpg`, `02 - Cheetos.jpg`
- **System automatically sorts alphabetically**
- **Files without prefixes appear first**

### Automatic Conversions:
- **ID**: `New Snack Brand.jpg` → `new-snack-brand`
- **Alt**: `New Snack Brand.jpg` → `new-snack-brand`
- **Caption**: `New Snack Brand.jpg` → `New Snack Brand`

## ➕ How to Add a New Category

### Step 1: Create Image Directory
1. Create a new directory in `src/assets/images/`
2. Example: `src/assets/images/new-category/`

### Step 2: Add Category Configuration
Add a new category object to `productCategories` in `src/config/productImages.js`:

```javascript
newcategory: {
  id: 'newcategory',
  title: 'New Category',
  description: 'Description of the new category and its products.',
  items: loadImagesFromDirectory('new-category')
}
```

### Step 3: Update Sync Script (Optional)
Add the new category to `scripts/syncImages.js` if you want automatic syncing.

### Step 4: Update Navigation (if needed)
If the new category should appear in navigation, update `src/components/Header.js`.

## 🎯 Best Practices

### Image Requirements:
- **Format**: JPG, JPEG, PNG, WebP, or GIF
- **Size**: 150px × 150px (or similar aspect ratio)
- **File Size**: Keep under 500KB for fast loading
- **Quality**: High quality, clear product images

### File Naming:
- **Use proper case**: `New Product.jpg` not `new-product.jpg`
- **Be descriptive**: `Energy Drink.jpg` not `drink.jpg`
- **Consistent**: Follow the same pattern across all categories
- **User-friendly**: Names should make sense to customers

### File Organization:
- **Category-based**: Organize by product type
- **Consistent naming**: Use same pattern across all categories
- **Descriptive**: Clear, meaningful file names

## 🚀 Quick Actions

### Add Product to Groceries:
1. Place image in `src/assets/images/groceries/` with proper name
2. **Done!** No configuration needed

### Add Product to Soft Drinks:
1. Place image in `src/assets/images/soft-drinks/` with proper name
2. **Done!** No configuration needed

### Remove Product:
1. Delete image file from `src/assets/images/` directory
2. **Done!** No configuration needed

### Reorder Products:
1. Rename files with numbered prefixes
2. **Done!** System automatically sorts them

### Manual Sync:
```bash
npm run sync-images
```

## 🔧 Troubleshooting

### Product Not Showing:
1. Check that the image file exists in `src/assets/images/` directory
2. Verify the file name matches exactly (case-sensitive)
3. Ensure the file is a supported image format (jpg, jpeg, png, webp, gif)
4. Check browser console for any errors
5. Run `npm run sync-images` to ensure public directory is updated

### Configuration Errors:
1. Verify the category path in `loadImagesFromDirectory('category-path')`
2. Ensure the directory exists in `src/assets/images/`
3. Check that the category object structure is correct

### Performance Issues:
1. Optimize image file sizes
2. Use WebP format when possible
3. Consider lazy loading for many products

## 📞 Support

If you need help managing product images:
1. Check the comments in `src/config/productImages.js`
2. Refer to this README file
3. Contact the development team

## 🎉 Benefits of Dynamic System with src/assets

- **Completely Dynamic**: require.context works properly with src/assets
- **File System Driven**: Just add/remove files in src/assets
- **Auto Sync**: Public directory automatically kept in sync
- **No Configuration Errors**: Impossible to have mismatched files
- **Easy Ordering**: Use numbered prefixes
- **Zero Maintenance**: System handles everything automatically
- **Webpack Optimized**: Images are processed and optimized during build
- **Development Friendly**: Works seamlessly with React development workflow 