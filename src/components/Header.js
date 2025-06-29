import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="/images/holly_valley_logo.png?v=1" alt="Holly Valley Logo" />
        </Link>
      </div>
      <nav>
        <ul className="navBar">
          <li className="dropdown">
            <Link 
              to="/" 
              className={`dropbtn ${isActive('/') ? 'activeLink' : ''}`}
              onClick={() => handleDropdownToggle('home')}
            >
              HOME
            </Link>
            <div className={`dropdown-content ${activeDropdown === 'home' ? 'show' : ''}`}>
              <a href="/#about-us">About Us</a>
              <a href="/#address">Address</a>
              <a href="/#hrs-of-opr">Hours of Operation</a>
            </div>
          </li>
          <li className="dropdown">
            <Link 
              to="/services" 
              className={`dropbtn ${isActive('/services') ? 'activeLink' : ''}`}
              onClick={() => handleDropdownToggle('services')}
            >
              SERVICES
            </Link>
            <div className={`dropdown-content ${activeDropdown === 'services' ? 'show' : ''}`}>
              <a href="/services#apt-payt">Accepted Forms of Payments</a>
              <a href="/services#atm">ATM</a>
              <a href="/services#nc-lottery">NC Lottery</a>
            </div>
          </li>
          <li className="dropdown">
            <Link 
              to="/products" 
              className={`dropbtn ${isActive('/products') ? 'activeLink' : ''}`}
              onClick={() => handleDropdownToggle('products')}
            >
              PRODUCTS
            </Link>
            <div className={`dropdown-content ${activeDropdown === 'products' ? 'show' : ''}`}>
              <a href="/products#groceries">Groceries</a>
              <a href="/products#softdrinks">Soft Drinks</a>
            </div>
          </li>
          <li className="navIcon">
            <Link to="/contact" className={isActive('/contact') ? 'activeLink' : ''}>
              CONTACT US
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 