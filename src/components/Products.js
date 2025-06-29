import React, { useState, useEffect } from 'react';
import { getAllProductCategories, refreshProductImages } from '../config/productImages';
import './Products.css';

const Products = () => {
  const [activeAccordion, setActiveAccordion] = useState('groceries');
  const [zoomedImage, setZoomedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products dynamically on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Refresh images from the JSON file
        await refreshProductImages();
        // Get the updated products
        const updatedProducts = getAllProductCategories();
        setProducts(updatedProducts);
      } catch (error) {
        console.warn('Could not load products dynamically:', error);
        // Fallback to static loading
        setProducts(getAllProductCategories());
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
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

  if (loading) {
    return (
      <div className="products">
        <div className="subsection products-subsection">
          <div className="subsection-content" id="subheader-content">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products">
      <div className="subsection products-subsection">
        <h2 className="subsection-heading" id="products">PRODUCTS</h2>
        <div className="subsection-content" id="subheader-content">
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
                  <React.Fragment key={item.id}>
                    {index % 4 === 0 && (
                      <tr>
                        {product.items.slice(index, index + 4).map((subItem, subIndex) => (
                          <td key={subItem.id}>
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
                          <td key={subItem.id} className="table-caption">{subItem.caption}</td>
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