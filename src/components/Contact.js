import React from 'react';
import { getImagePath } from '../utils/imageUtils';
import { track } from '../utils/ga';
import './Contact.css';

const phoneNumber = '(336)304-0094';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654';

const Contact = () => {
  const onCallClick = () => {
    track('contact_click', { method: 'phone', location: 'contact' });
  };

  const onDirectionsClick = () => {
    track('get_directions', { provider: 'google_maps', location: 'contact' });
  };

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
            <li>
              <p>
                Phone No: <a href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`} onClick={onCallClick}>{phoneNumber}</a>
              </p>
            </li>
            <li>
              Location:<br />
              <span style={{ display: 'block', marginLeft: '1em' }}>
                2730 NC Hwy 18 S<br />
                Moravian Falls, NC 28654
              </span>
              <div style={{ marginTop: '8px' }}>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" onClick={onDirectionsClick}>
                  Get Directions
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact; 