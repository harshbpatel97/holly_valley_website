import React from 'react';
import { getImagePath } from '../utils/imageUtils';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <div className="subsection">
        <h2 className="subsection-heading" id="contact">CONTACT US</h2>
        <div className="subsection-content" id="subheader-content">
          <div className="contact-logo">
            <img src={getImagePath("/images/misc/contact.png")} alt="contact-logo" />
          </div>
          <p className="textAlignLeft">Holly Valley values customer satisfaction. If any queries or questions, feel free to reach
            through the following medium of communication: </p>
          <ul className="list-design">
            <li><p>Phone No: (336)304-0094</p></li>
            <li>Location:<br />
              <span style={{ display: 'block', marginLeft: '1em' }}>
                2730 NC Hwy 18 S<br />
                Moravian Falls, NC 28654
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact; 