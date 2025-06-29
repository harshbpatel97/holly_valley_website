import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: '/images/holly_valley_front_view.JPG', alt: 'Front View', title: 'Front View' },
    { src: '/images/holly_valley_left_view.JPG', alt: 'Left Side View', title: 'Left Side View' },
    { src: '/images/holly_valley_right_view.JPG', alt: 'Right Side View', title: 'Right Side View' },
    { src: '/images/holly_valley_uhaul.jpg', alt: 'UHaul', title: 'UHaul' },
    { src: '/images/holly_valley_inside_view1.jpg', alt: 'Inside View 1', title: 'Inside View 1' },
    { src: '/images/holly_valley_inside_view2.jpg', alt: 'Inside View 2', title: 'Inside View 2' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home">
      <div className="page-heading">
        <h1>WELCOME TO HOLLY VALLEY</h1>
      </div>

      <div className="slider" id="slideshow-container">
        <div className="slide-container">
          {slides.map((slide, index) => (
            <div
              key={index}
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
          <button className="prev" onClick={prevSlide}>&#10094;</button>
          <button className="next" onClick={nextSlide}>&#10095;</button>
        </div>
        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="subsection">
        <h2 className="subsection-heading" id="about-us">About Us</h2>
        <div className="subsection-content textAlignLeft">
          <p>Holly Valley: is a convenience store which aims at providing excellent customer service. It offers variety of products and services
            ranging from grocery, cigarettes, tobacco & vape products, cold beer, snacks, beverages, soft drinks, ATM & Bitcoin machine, etc.
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
          <img src="/images/open-sign.png" className="img-open-sign" alt="open-sign" />
          <img src="/images/7days.png" className="img-7days-sign" alt="7days" />
        </div>
      </div>
    </div>
  );
};

export default Home; 