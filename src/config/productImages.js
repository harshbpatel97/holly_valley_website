// Product Images Configuration
// All product images are organized by category for easy management
// To add a new product: Add it to the appropriate category array
// To remove a product: Delete it from the category array
// To reorder products: Change the order in the array

export const productCategories = {
  groceries: {
    id: 'groceries',
    title: 'Groceries',
    description: 'All the grocery items are available in single or combo pack depending on the type. Moreover, we do carry different brands of the items. For more information, visit the local store.',
    items: [
      {
        id: 'bread',
        src: '/images/groceries/bread.jpg',
        alt: 'bread',
        caption: 'Bread'
      },
      {
        id: 'cheetos',
        src: '/images/groceries/cheetos.jpg',
        alt: 'cheetos',
        caption: 'Cheetos'
      },
      {
        id: 'chocolates',
        src: '/images/groceries/chocolates.jpg',
        alt: 'chocolates',
        caption: 'Chocolates'
      },
      {
        id: 'chewing-gum',
        src: '/images/groceries/chewing-gum.jpg',
        alt: 'chewing-gum',
        caption: 'Chewing-Gums'
      },
      {
        id: 'skittles',
        src: '/images/groceries/skittles.jpg',
        alt: 'skittles',
        caption: 'Skittles'
      },
      {
        id: 'rice-crispy',
        src: '/images/groceries/rice-crispy.jpg',
        alt: 'rice-crispy',
        caption: 'Rice Krispies Treats'
      },
      {
        id: 'cleaners',
        src: '/images/groceries/cleaners.jpg',
        alt: 'cleaners',
        caption: 'Cleaning Sprays'
      },
      {
        id: 'dawn',
        src: '/images/groceries/dawn.jpg',
        alt: 'dawn',
        caption: 'Dawn Liquid Wash'
      },
      {
        id: 'lays',
        src: '/images/groceries/lays.jpg',
        alt: 'lays',
        caption: 'Lays'
      },
      {
        id: 'dial',
        src: '/images/groceries/dial.jpg',
        alt: 'dial',
        caption: 'Dial Handwash'
      },
      {
        id: 'dog-products',
        src: '/images/groceries/dog-products.jpg',
        alt: 'dog-products',
        caption: 'Dog Products'
      },
      {
        id: 'doritos',
        src: '/images/groceries/doritos.jpg',
        alt: 'doritos',
        caption: 'Doritos'
      },
      {
        id: 'dove',
        src: '/images/groceries/dove.jpg',
        alt: 'dove',
        caption: 'Dove Products'
      },
      {
        id: 'eggs',
        src: '/images/groceries/eggs.jpg',
        alt: 'eggs',
        caption: 'Eggs'
      },
      {
        id: 'milk',
        src: '/images/groceries/milk.jpg',
        alt: 'milk',
        caption: 'Dairy Products'
      },
      {
        id: 'funyuns',
        src: '/images/groceries/funyuns.jpg',
        alt: 'funyuns',
        caption: 'Funyuns'
      }
    ]
  },
  softdrinks: {
    id: 'softdrinks',
    title: 'Soft Drinks',
    description: 'We offer a wide variety of soft drinks, sodas, and beverages from popular brands. All beverages are available in different sizes and flavors.',
    items: [
      {
        id: 'coca-cola',
        src: '/images/soft-drinks/coca-cola.jpg',
        alt: 'coca-cola',
        caption: 'Coca Cola'
      },
      {
        id: 'pepsi',
        src: '/images/soft-drinks/pepsi.jpg',
        alt: 'pepsi',
        caption: 'Pepsi'
      },
      {
        id: 'sprite',
        src: '/images/soft-drinks/sprite.jpg',
        alt: 'sprite',
        caption: 'Sprite'
      },
      {
        id: 'fanta',
        src: '/images/soft-drinks/fanta.jpg',
        alt: 'fanta',
        caption: 'Fanta'
      },
      {
        id: '7up',
        src: '/images/soft-drinks/7up.jpg',
        alt: '7up',
        caption: '7UP'
      },
      {
        id: 'dr-pepper',
        src: '/images/soft-drinks/drpepper.jpg',
        alt: 'dr-pepper',
        caption: 'Dr Pepper'
      },
      {
        id: 'sunkist',
        src: '/images/soft-drinks/sunkist.jpg',
        alt: 'sunkist',
        caption: 'Sunkist'
      },
      {
        id: 'a&w',
        src: '/images/soft-drinks/a&w.jpg',
        alt: 'a&w',
        caption: 'A&W'
      },
      {
        id: 'canada-dry',
        src: '/images/soft-drinks/canada-dry.jpg',
        alt: 'canada-dry',
        caption: 'Canada Dry'
      },
      {
        id: 'tea',
        src: '/images/soft-drinks/tea.jpg',
        alt: 'tea',
        caption: 'Tea'
      },
      {
        id: 'brisk-tea',
        src: '/images/soft-drinks/brisk-tea.jpg',
        alt: 'brisk-tea',
        caption: 'Brisk Tea'
      },
      {
        id: 'starbucks',
        src: '/images/soft-drinks/starbucks.jpg',
        alt: 'starbucks',
        caption: 'Starbucks'
      }
    ]
  }
};

// Helper function to get all product categories
export const getAllProductCategories = () => {
  return Object.values(productCategories);
};

// Helper function to get a specific category
export const getProductCategory = (categoryId) => {
  return productCategories[categoryId];
};

// Instructions for managing product images:
/*
NEW SYSTEM: All product images are now managed through this configuration file

To ADD a new product:
1. Place the product image in the appropriate directory:
   - Groceries: public/images/groceries/
   - Soft Drinks: public/images/soft-drinks/
2. Add a new object to the appropriate category's items array:
   {
     id: 'unique-product-id',
     src: '/images/category/product-image.jpg',
     alt: 'Product name for accessibility',
     caption: 'Product display name'
   }

To REMOVE a product:
1. Delete the object from the category's items array
2. Optionally remove the image file from the directory

To REORDER products:
1. Simply change the order of objects in the items array
2. The display order will automatically reflect the new arrangement

To ADD a new category:
1. Add a new category object to productCategories
2. Include: id, title, description, and items array
3. Update the Products component to use the new category

RECOMMENDED NAMING CONVENTIONS:
- Product IDs: lowercase with hyphens (e.g., 'coca-cola', 'rice-crispy')
- Image files: lowercase with hyphens (e.g., 'coca-cola.jpg', 'rice-crispy.jpg')
- Captions: Proper case for display (e.g., 'Coca Cola', 'Rice Krispies Treats')

EXAMPLE ADDING NEW PRODUCT:
{
  id: 'new-snack',
  src: '/images/groceries/new-snack.jpg',
  alt: 'new-snack',
  caption: 'New Snack Brand'
}
*/ 