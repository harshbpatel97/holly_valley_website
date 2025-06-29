// Store Images Configuration
// All images in the public/images/storeImages/ directory will be automatically displayed
// To add a new image: Simply place it in the storeImages directory
// To remove an image: Delete it from the storeImages directory
// To reorder images: Rename files with numbers (01_, 02_, etc.)

// Image naming convention for automatic ordering:
// Use numbers at the beginning of filenames to control order:
// 01_front_view.jpg, 02_left_view.jpg, 03_right_view.jpg, etc.

export const storeImages = [
  {
    id: 'front-view',
    src: '/images/storeImages/01_store_front_view.jpg',
    alt: 'Front View',
    title: 'Front View',
    description: 'Front view of Holly Valley store'
  },
  {
    id: 'left-view',
    src: '/images/storeImages/02_store_left_view.jpg',
    alt: 'Left Side View',
    title: 'Left Side View',
    description: 'Left side view of Holly Valley store'
  },
  {
    id: 'right-view',
    src: '/images/storeImages/03_store_right_view.jpg',
    alt: 'Right Side View',
    title: 'Right Side View',
    description: 'Right side view of Holly Valley store'
  },
  {
    id: 'uhaul',
    src: '/images/storeImages/04_uhaul_services.jpg',
    alt: 'UHaul Services',
    title: 'UHaul Services',
    description: 'U-Haul rental services available at Holly Valley'
  },
  {
    id: 'inside-view-1',
    src: '/images/storeImages/05_inside_view_1.jpg',
    alt: 'Inside View 1',
    title: 'Inside View 1',
    description: 'Inside view of Holly Valley store'
  },
  {
    id: 'inside-view-2',
    src: '/images/storeImages/06_inside_view_2.jpg',
    alt: 'Inside View 2',
    title: 'Inside View 2',
    description: 'Another inside view of Holly Valley store'
  }
];

// Slider Configuration
export const sliderConfig = {
  autoPlay: true,
  autoPlayInterval: 3000, // 3 seconds
  showDots: true,
  showNavigation: true,
  loop: true
};

// Instructions for managing images:
/*
NEW SYSTEM: All images are now stored in public/images/storeImages/ directory

To ADD a new image:
1. Place the image file in public/images/storeImages/ directory
2. Update this configuration file to include the new image
3. Use the following format:
   {
     id: 'unique-id',
     src: '/images/storeImages/your-image.jpg',
     alt: 'Alt text for accessibility',
     title: 'Image title',
     description: 'Brief description of the image'
   }

To REMOVE an image:
1. Delete the image file from public/images/storeImages/ directory
2. Remove the object from this storeImages array

To REORDER images:
1. Rename files with numbers: 01_front.jpg, 02_left.jpg, 03_right.jpg, etc.
2. Update the order in this storeImages array to match

RECOMMENDED NAMING CONVENTION:
- Use numbers for ordering: 01_, 02_, 03_, etc.
- Use descriptive names: 01_store_front.jpg, 02_inside_view.jpg
- Use lowercase with hyphens or underscores
- Supported formats: JPG, JPEG, PNG, WebP

EXAMPLE:
01_store_front.jpg
02_store_left.jpg
03_store_right.jpg
04_uhaul_services.jpg
05_inside_view_1.jpg
06_inside_view_2.jpg
*/ 