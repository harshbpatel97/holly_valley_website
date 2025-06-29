import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <h3>Quick Links</h3>
        <ul className="quick-links">
          <li className="quick-icon">
            <Link to="/">HOME</Link>
          </li>
          <li className="quick-icon">
            <Link to="/services">SERVICES</Link>
          </li>
          <li className="quick-icon">
            <Link to="/products">PRODUCTS</Link>
          </li>
          <li className="quick-icon">
            <Link to="/contact">CONTACT US</Link>
          </li>
        </ul>
      </div>
      <div className="copyright">
        <p>Contact Us: +1(336)304-0094</p>
        <p>&copy;HOLLY VALLEY INC.</p>
      </div>
    </footer>
  );
};

export default Footer; 