import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storeImages, sliderConfig } from '../config/storeImages';
import { getImagePath } from '../utils/imageUtils';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!sliderConfig.autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storeImages.length);
    }, sliderConfig.autoPlayInterval);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storeImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storeImages.length) % storeImages.length);
  };

  return (
    <div className="home">
      <div className="page-heading">
        <h1>WELCOME TO HOLLY VALLEY</h1>
      </div>

      <div className="slider" id="slideshow-container">
        <div className="slide-container">
          {storeImages.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img 
                src={slide.src} 
                className="store-image" 
                alt={slide.alt} 
                title={slide.title}
              />
            </div>
          ))}
          {sliderConfig.showNavigation && (
            <>
              <button className="prev" onClick={prevSlide}>&#10094;</button>
              <button className="next" onClick={nextSlide}>&#10095;</button>
            </>
          )}
        </div>
        {sliderConfig.showDots && (
          <div className="dots">
            {storeImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        )}
      </div>

      <div className="subsection">
        <h2 className="subsection-heading" id="about-us">About Us</h2>
        <div className="subsection-content textAlignLeft">
          <p>Holly Valley: is a convenience store which aims at providing excellent customer service. It offers variety of products and services
            ranging from grocery, snacks, beverages, soft drinks, ATM & Bitcoin machine, etc.
            We accept all forms of payment including EBT too. We also provide U-Haul rental services.</p>

          <p>The store is located in the town of Moravian Falls of NC on Old NC Highway 18 S.</p>
        </div>
      </div>

      <div className="subsection" id="address-section">
        <h2 className="subsection-heading" id="address">Address</h2>
        <div className="subsection-content">
          <address>2730 NC Hwy 18 S <br />
            Moravian Falls<br />
            NC-28654
          </address>
        </div>
        <div className="google-map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51576.80827655196!2d-81.22339562721537!3d36.10444355488105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885113264059d395%3A0xa1eb466dc155b46d!2sHolly%20Valley!5e0!3m2!1sen!2sus!4v1639761501521!5m2!1sen!2sus" 
            allowFullScreen=""
            title="Holly Valley Location"
          >
          </iframe>
        </div>
      </div>

      <div className="subsection">
        <h2 className="subsection-heading" id="hrs-of-opr">Hours of Operation</h2>
        <div className="subsection-content">
          <p>We are open 7 days a week and closed during national holidays.</p>
          <p>Our normal business hours are below:-</p>
          <p>MONDAY - FRIDAY</p>
          <p>8:00AM - 8:00PM</p>
          <p>SATURDAY</p>
          <p>8:00AM - 8:00PM</p>
          <p>SUNDAY</p>
          <p>11:00AM - 7:30PM</p>
          <div className="open-signs">
            <img src={getImagePath("/images/misc/open-sign.png")} className="img-open-sign" alt="open-sign" />
            <img src={getImagePath("/images/misc/7days.png")} className="img-7days-sign" alt="7days" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 