import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { track } from '../utils/ga';

const Footer = () => {
  const onNavClick = (label) => track('nav_click', { label, location: 'footer' });
  const onPhoneClick = () => track('contact_click', { method: 'phone', location: 'footer' });

  return (
    <footer>
      <div className="footer-content">
        <h3>Quick Links</h3>
        <ul className="quick-links">
          <li className="quick-icon">
            <Link to="/" onClick={() => onNavClick('HOME')}>HOME</Link>
          </li>
          <li className="quick-icon">
            <Link to="/services" onClick={() => onNavClick('SERVICES')}>SERVICES</Link>
          </li>
          <li className="quick-icon">
            <Link to="/products" onClick={() => onNavClick('PRODUCTS')}>PRODUCTS</Link>
          </li>
          <li className="quick-icon">
            <Link to="/contact" onClick={() => onNavClick('CONTACT US')}>CONTACT US</Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <p>
          Contact Us: <a href="tel:13363040094" onClick={onPhoneClick}>+1(336)304-0094</a>
        </p>
        <p>&copy;HOLLY VALLEY INC.</p>
        <div className="legal-links">
          <small>
            Legal Notice | Privacy Policy | Terms of Service
          </small>
        </div>
        <small>Age Restricted Products: Tobacco/Alcohol 21+ | Lottery 18+ | ID Required | Gambling Problem? Call 1-800-522-4700</small>
      </div>
    </footer>
  );
};

export default Footer; 