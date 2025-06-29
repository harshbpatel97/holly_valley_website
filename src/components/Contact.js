import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <div className="subsection">
        <h2 className="subsection-heading" id="contact">CONTACT US</h2>
        <div className="subsection-content" id="subheader-content">
          <div className="contact-logo">
            <img src="/images/misc/contact.png" alt="contact-logo" />
          </div>
          <p className="textAlignLeft">Holly Valley values customer satisfaction. If any queries or questions, feel free to reach
            through the following medium of communication: </p>
          <ul className="list-design">
            <li><p>Phone No: (336)304-0094</p></li>
            <li>Location:
              <ul className="location-list">
                <li>2730 NC Hwy 18 S</li>
                <li>Moravian Falls</li>
                <li>NC-28654</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact; 