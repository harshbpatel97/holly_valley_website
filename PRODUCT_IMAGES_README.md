# Product Images Management Guide

This guide explains how to easily add, remove, and manage product images on the Holly Valley website.

## 📁 File Structure
- **Configuration**: `src/config/productImages.js`
- **Groceries Images**: `public/images/groceries/`
- **Soft Drinks Images**: `public/images/soft-drinks/`

## 🖼️ How to Add a New Product

### Step 1: Add the Product Image
1. Place your product image in the appropriate directory:
   - **Groceries**: `public/images/groceries/`
   - **Soft Drinks**: `public/images/soft-drinks/`
2. Supported formats: JPG, JPEG, PNG, WebP
3. Recommended size: 150px × 150px (or similar aspect ratio)
4. **Naming Convention**: Use lowercase with hyphens (e.g., `new-snack.jpg`, `energy-drink.jpg`)

### Step 2: Update the Configuration
Open `src/config/productImages.js` and add a new object to the appropriate category's `items` array:

```javascript
{
  id: 'unique-product-id',
  src: '/images/category/product-image.jpg',
  alt: 'Product name for accessibility',
  caption: 'Product display name'
}
```

### Example - Adding New Grocery Item:
```javascript
{
  id: 'new-snack',
  src: '/images/groceries/new-snack.jpg',
  alt: 'new-snack',
  caption: 'New Snack Brand'
}
```

### Example - Adding New Soft Drink:
```javascript
{
  id: 'energy-drink',
  src: '/images/soft-drinks/energy-drink.jpg',
  alt: 'energy-drink',
  caption: 'Energy Drink'
}
```

## ❌ How to Remove a Product

### Step 1: Remove from Configuration
1. Open `src/config/productImages.js`
2. Find the product in the appropriate category's `items` array
3. Delete the entire object for the product you want to remove
4. Save the file

### Step 2: Remove the Image File (Optional)
1. Delete the image file from the appropriate directory
2. This step is optional but recommended to keep the project clean

## 🔄 How to Reorder Products

1. Open `src/config/productImages.js`
2. Simply change the order of objects in the `items` array
3. The display order will automatically reflect the new arrangement

## 📋 Current Product Structure

### Groceries Category (16 items):
```
public/images/groceries/
├── bread.jpg              # Bread
├── cheetos.jpg            # Cheetos
├── chocolates.jpg         # Chocolates
├── chewing-gum.jpg        # Chewing-Gums
├── skittles.jpg           # Skittles
├── rice-crispy.jpg        # Rice Krispies Treats
├── cleaners.jpg           # Cleaning Sprays
├── dawn.jpg               # Dawn Liquid Wash
├── lays.jpg               # Lays
├── dial.jpg               # Dial Handwash
├── dog-products.jpg       # Dog Products
├── doritos.jpg            # Doritos
├── dove.jpg               # Dove Products
├── eggs.jpg               # Eggs
├── milk.jpg               # Dairy Products
└── funyuns.jpg            # Funyuns
```

### Soft Drinks Category (12 items):
```
public/images/soft-drinks/
├── coca-cola.jpg          # Coca Cola
├── pepsi.jpg              # Pepsi
├── sprite.jpg             # Sprite
├── fanta.jpg              # Fanta
├── 7up.jpg                # 7UP
├── drpepper.jpg           # Dr Pepper
├── sunkist.jpg            # Sunkist
├── a&w.jpg                # A&W
├── canada-dry.jpg         # Canada Dry
├── tea.jpg                # Tea
├── brisk-tea.jpg          # Brisk Tea
└── starbucks.jpg          # Starbucks
```

## 🎯 Recommended Naming Conventions

### Product IDs:
- Use lowercase with hyphens
- Be descriptive but concise
- Examples: `coca-cola`, `rice-crispy`, `new-snack`

### Image Files:
- Use lowercase with hyphens
- Match the product ID
- Examples: `coca-cola.jpg`, `rice-crispy.jpg`, `new-snack.jpg`

### Captions:
- Use proper case for display
- Be user-friendly
- Examples: `Coca Cola`, `Rice Krispies Treats`, `New Snack Brand`

## ➕ How to Add a New Category

### Step 1: Create Image Directory
1. Create a new directory in `public/images/`
2. Example: `public/images/new-category/`

### Step 2: Add Category Configuration
Add a new category object to `productCategories` in `src/config/productImages.js`:

```javascript
newcategory: {
  id: 'newcategory',
  title: 'New Category',
  description: 'Description of the new category and its products.',
  items: [
    {
      id: 'first-product',
      src: '/images/new-category/first-product.jpg',
      alt: 'first-product',
      caption: 'First Product'
    }
    // Add more products...
  ]
}
```

### Step 3: Update Navigation (if needed)
If the new category should appear in navigation, update `src/components/Header.js`.

## 🎯 Best Practices

### Image Requirements:
- **Format**: JPG, JPEG, PNG, or WebP
- **Size**: 150px × 150px (or similar aspect ratio)
- **File Size**: Keep under 500KB for fast loading
- **Quality**: High quality, clear product images

### File Organization:
- **Category-based**: Organize by product type
- **Consistent naming**: Use same pattern across all categories
- **Descriptive**: Clear, meaningful file names

### Accessibility:
- Always provide meaningful `alt` text
- Use descriptive captions
- Ensure good contrast in images

## 🚀 Quick Actions

### Add Product to Groceries:
1. Place image in `public/images/groceries/`
2. Add object to `productCategories.groceries.items`

### Add Product to Soft Drinks:
1. Place image in `public/images/soft-drinks/`
2. Add object to `productCategories.softdrinks.items`

### Remove Product:
1. Delete object from configuration
2. Optionally delete image file

### Reorder Products:
1. Change order in `items` array
2. Save configuration file

## 🔧 Troubleshooting

### Product Not Showing:
1. Check the file path in `src` property
2. Ensure the image file exists in the correct directory
3. Verify the file name matches exactly (case-sensitive)
4. Check that the object is properly added to the `items` array

### Configuration Errors:
1. Verify JSON syntax in configuration file
2. Check that all required properties are present (`id`, `src`, `alt`, `caption`)
3. Ensure category structure is correct

### Performance Issues:
1. Optimize image file sizes
2. Use WebP format when possible
3. Consider lazy loading for many products

## 📞 Support

If you need help managing product images:
1. Check the comments in `src/config/productImages.js`
2. Refer to this README file
3. Contact the development team

## 🎉 Benefits of New System

- **Organized**: All products organized by category
- **Simple**: Just add image and update config
- **Flexible**: Easy to add, remove, and reorder products
- **Maintainable**: Clear structure and naming conventions
- **Scalable**: Easy to add new categories and products
- **Consistent**: Same pattern as store images management 