import React, { useState, useEffect } from 'react';
import './Products.css';

const Products = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const products = [
    {
      id: 'groceries',
      title: 'Groceries',
      description: 'All the grocery items are available in single or combo pack depending on the type. Moreover, we do carry different brands of the items. For more information, visit the local store.',
      items: [
        { src: '/images/groceries/bread.jpg', alt: 'bread', caption: 'Bread' },
        { src: '/images/groceries/cheetos.jpg', alt: 'cheetos', caption: 'Cheetos' },
        { src: '/images/groceries/chocolates.jpg', alt: 'chocolates', caption: 'Chocolates' },
        { src: '/images/groceries/chewing-gum.jpg', alt: 'chewing-gum', caption: 'Chewing-Gums' },
        { src: '/images/groceries/skittles.jpg', alt: 'skittles', caption: 'Skittles' },
        { src: '/images/groceries/rice-crispy.jpg', alt: 'rice-crispy', caption: 'Rice Krispies Treats' },
        { src: '/images/groceries/cleaners.jpg', alt: 'cleaners', caption: 'Cleaning Sprays' },
        { src: '/images/groceries/dawn.jpg', alt: 'dawn', caption: 'Dawn Liquid Wash' },
        { src: '/images/groceries/lays.jpg', alt: 'lays', caption: 'Lays' },
        { src: '/images/groceries/dial.jpg', alt: 'dial', caption: 'Dial Handwash' },
        { src: '/images/groceries/dog-products.jpg', alt: 'dog-products', caption: 'Dog Products' },
        { src: '/images/groceries/doritos.jpg', alt: 'doritos', caption: 'Doritos' },
        { src: '/images/groceries/dove.jpg', alt: 'dove', caption: 'Dove Products' },
        { src: '/images/groceries/eggs.jpg', alt: 'eggs', caption: 'Eggs' },
        { src: '/images/groceries/milk.jpg', alt: 'milk', caption: 'Dairy Products' },
        { src: '/images/groceries/funyuns.jpg', alt: 'funyuns', caption: 'Funyuns' }
      ]
    },
    {
      id: 'tobacco',
      title: 'Tobacco',
      description: 'All the tobacco products of below brands are available in can, dip, tower, roll, and bag sizes, and flavors such as wintergreen, menthol, fine cut, long cut and many more... (Note: You must be at least 21 years of age to purchase cigarettes from this store)',
      items: [
        { src: '/images/tobacco/copehagen.jpg', alt: 'copenhagen', caption: 'Copenhagen' },
        { src: '/images/tobacco/good-stuff.jpg', alt: 'good-stuff', caption: 'Good Stuff' },
        { src: '/images/tobacco/grizzly.jpg', alt: 'grizzly', caption: 'Grizzly' },
        { src: '/images/tobacco/criss-cross.jpg', alt: 'criss-cross', caption: 'Criss Cross' },
        { src: '/images/tobacco/klondike.jpg', alt: 'klondike', caption: 'Klondike' },
        { src: '/images/tobacco/longhorn.jpg', alt: 'longhorn', caption: 'Longhorn' },
        { src: '/images/tobacco/ohm.jpg', alt: 'ohm', caption: 'Ohm' },
        { src: '/images/tobacco/gambler.jpg', alt: 'gambler', caption: 'Gambler' },
        { src: '/images/tobacco/redman.jpg', alt: 'redman', caption: 'Red Man' },
        { src: '/images/tobacco/skoals.jpg', alt: 'skoals-products', caption: 'Skoal' },
        { src: '/images/tobacco/smokey-mountain.jpg', alt: 'smokey-mountain', caption: 'Smokey Mountain' },
        { src: '/images/tobacco/american-club.jpg', alt: 'american-club', caption: 'American Club' },
        { src: '/images/tobacco/velo.jpg', alt: 'velo', caption: 'Velo' },
        { src: '/images/tobacco/stokers.jpg', alt: 'stokers', caption: "Stoker's" },
        { src: '/images/tobacco/wolf.jpg', alt: 'wolf', caption: 'Wolf' },
        { src: '/images/tobacco/shargio.jpg', alt: 'shargio', caption: 'Shargio' }
      ]
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleImageClick = (imageSrc) => {
    setZoomedImage(imageSrc);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  useEffect(() => {
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [zoomedImage]);

  return (
    <div className="products">
      <div className="subsection products-subsection">
        <h2 className="subsection-heading" id="products">PRODUCTS</h2>
        <div className="subsection-content" id="subheader-content">
          <div className="services-logo">
            <img src="/images/products-logo.png" alt="products-logo" />
          </div>
          <p>Holly Valley offers a variety of products ranging from groceries to soft-drinks.
            A detailed overview of each department is mentioned along with the brands and options
            available in each category.</p>
        </div>
      </div>

      <div className="subsection products-subsection">
        {products.map((product) => (
          <div key={product.id} className="accordion" id={product.id}>
            <h3 
              className={`accordion-header ${activeAccordion === product.id ? 'active' : ''}`}
              onClick={() => toggleAccordion(product.id)}
            >
              {product.title}
            </h3>
            <div className={`panel-products ${activeAccordion === product.id ? 'active' : ''}`}>
              <table className="table-design">
                <tr>
                  <th colSpan="4" className="table-heading">{product.description}</th>
                </tr>
                {product.items.map((item, index) => (
                  <React.Fragment key={index}>
                    {index % 4 === 0 && (
                      <tr>
                        {product.items.slice(index, index + 4).map((subItem, subIndex) => (
                          <td key={subIndex}>
                            <img 
                              src={subItem.src} 
                              alt={subItem.alt} 
                              className="img-design"
                              onClick={() => handleImageClick(subItem.src)}
                            />
                          </td>
                        ))}
                        {Array.from({ length: 4 - (product.items.length - index) }, (_, i) => (
                          <td key={`empty-${i}`}></td>
                        ))}
                      </tr>
                    )}
                    {index % 4 === 0 && (
                      <tr>
                        {product.items.slice(index, index + 4).map((subItem, subIndex) => (
                          <td key={subIndex} className="table-caption">{subItem.caption}</td>
                        ))}
                        {Array.from({ length: 4 - (product.items.length - index) }, (_, i) => (
                          <td key={`empty-caption-${i}`}></td>
                        ))}
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </table>
            </div>
          </div>
        ))}
      </div>

      {zoomedImage && (
        <div className="image-zoom-overlay" onClick={closeZoom}>
          <div className="image-zoom-container">
            <img src={zoomedImage} alt="Zoomed" />
            <button className="close-zoom" onClick={closeZoom}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 