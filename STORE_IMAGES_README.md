# Store Images Management Guide

This guide explains how to easily add, remove, and manage store images on the Holly Valley website.

## 📁 File Structure
- **Images Directory**: `public/images/storeImages/`
- **Configuration**: `src/config/storeImages.js`

## 🖼️ How to Add a New Image

### Step 1: Add the Image File
1. Place your image file in the `public/images/storeImages/` directory
2. Supported formats: JPG, JPEG, PNG, WebP
3. Recommended size: 850px width × 410px height (or similar aspect ratio)
4. **Naming Convention**: Use numbers for ordering (e.g., `01_front_view.jpg`, `02_left_view.jpg`)

### Step 2: Update the Configuration
Open `src/config/storeImages.js` and add a new object to the `storeImages` array:

```javascript
{
  id: 'unique-identifier',
  src: '/images/storeImages/your-image-name.jpg',
  alt: 'Descriptive alt text for accessibility',
  title: 'Image title shown on hover',
  description: 'Brief description of the image'
}
```

### Example:
```javascript
{
  id: 'new-store-sign',
  src: '/images/storeImages/07_new_store_sign.jpg',
  alt: 'New Store Sign',
  title: 'New Store Sign',
  description: 'Updated store sign with new branding'
}
```

## ❌ How to Remove an Image

### Step 1: Remove the File
1. Delete the image file from `public/images/storeImages/` directory

### Step 2: Remove from Configuration
1. Open `src/config/storeImages.js`
2. Delete the entire object for the image you want to remove
3. Save the file

## 🔄 How to Reorder Images

### Method 1: Rename Files (Recommended)
1. Rename files with numbers: `01_front.jpg`, `02_left.jpg`, `03_right.jpg`, etc.
2. Update the order in `storeImages` array to match the new file names

### Method 2: Change Array Order
1. Open `src/config/storeImages.js`
2. Simply change the order of objects in the `storeImages` array
3. The slider will automatically reflect the new order

## 📋 Current Images Structure

```
public/images/storeImages/
├── 01_store_front_view.jpg      # Front view of store
├── 02_store_left_view.jpg       # Left side view
├── 03_store_right_view.jpg      # Right side view
├── 04_uhaul_services.jpg        # U-Haul services
├── 05_inside_view_1.jpg         # Inside view 1
└── 06_inside_view_2.jpg         # Inside view 2
```

## 🎯 Recommended Naming Convention

### Current Implementation:
```
01_store_front_view.jpg
02_store_left_view.jpg
03_store_right_view.jpg
04_uhaul_services.jpg
05_inside_view_1.jpg
06_inside_view_2.jpg
```

### For Adding New Images:
```
07_new_feature.jpg
08_updated_sign.jpg
09_special_offer.jpg
10_holiday_decorations.jpg
```

### Benefits:
- **Automatic ordering** by filename
- **Easy to insert** new images in specific positions
- **Clear organization** of content
- **Simple management** for non-technical users
- **Consistent naming** pattern

## ⚙️ Slider Configuration

You can customize the slider behavior by modifying the `sliderConfig` object:

```javascript
export const sliderConfig = {
  autoPlay: true,              // Enable/disable auto-play
  autoPlayInterval: 3000,      // Time between slides (milliseconds)
  showDots: true,              // Show/hide navigation dots
  showNavigation: true,        // Show/hide prev/next buttons
  loop: true                   // Enable/disable infinite loop
};
```

## 🚀 Quick Actions

### Disable Auto-play:
```javascript
autoPlay: false
```

### Change Slide Interval:
```javascript
autoPlayInterval: 5000  // 5 seconds
```

### Hide Navigation Dots:
```javascript
showDots: false
```

### Hide Navigation Buttons:
```javascript
showNavigation: false
```

## 🎯 Best Practices

### Image Requirements:
- **Format**: JPG, JPEG, PNG, or WebP
- **Size**: 850px × 410px (or similar aspect ratio)
- **File Size**: Keep under 2MB for fast loading
- **Quality**: High quality, clear images

### File Organization:
- **Directory**: Always use `public/images/storeImages/`
- **Naming**: Use numbers for ordering (01_, 02_, 03_, etc.)
- **Descriptive**: Use clear, descriptive names
- **Consistent**: Maintain consistent naming patterns

### Accessibility:
- Always provide meaningful `alt` text
- Use descriptive `title` text
- Include helpful `description` text

## 🔧 Troubleshooting

### Image Not Showing:
1. Check the file path in `src` property (should be `/images/storeImages/`)
2. Ensure the image file exists in `public/images/storeImages/`
3. Verify the file name matches exactly (case-sensitive)

### Slider Not Working:
1. Check that `storeImages` array is not empty
2. Verify all objects have required properties (`id`, `src`, `alt`, `title`)
3. Ensure `sliderConfig` properties are valid

### Performance Issues:
1. Optimize image file sizes
2. Use WebP format when possible
3. Consider lazy loading for many images

## 📞 Support

If you need help managing store images:
1. Check the comments in `src/config/storeImages.js`
2. Refer to this README file
3. Contact the development team

## 🎉 Benefits of New System

- **Organized**: All store images in one dedicated directory
- **Simple**: Just drop images in the folder and update config
- **Flexible**: Easy to add, remove, and reorder images
- **Maintainable**: Clear structure and naming conventions
- **Scalable**: Easy to manage as the business grows 