import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { track } from '../utils/ga';

const Footer = () => {
  const onNavClick = (label, path) => track('nav_link_click', { link_text: label, location: 'footer', path });
  const onPhoneClick = () => track('phone_click', { location: 'footer' });

  return (
    <footer>
      <div className="footer-content">
        <h3>Quick Links</h3>
        <ul className="quick-links">
          <li className="quick-icon">
            <Link to="/" onClick={() => onNavClick('HOME', '/')}>HOME</Link>
          </li>
          <li className="quick-icon">
            <Link to="/services" onClick={() => onNavClick('SERVICES', '/services')}>SERVICES</Link>
          </li>
          <li className="quick-icon">
            <Link to="/products" onClick={() => onNavClick('PRODUCTS', '/products')}>PRODUCTS</Link>
          </li>
          <li className="quick-icon">
            <Link to="/contact" onClick={() => onNavClick('CONTACT US', '/contact')}>CONTACT US</Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <p>
          Contact Us: <a href="tel:13363040094" onClick={onPhoneClick}>+1(336)304-0094</a>
        </p>
        <p>DBA Holly Valley</p>
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