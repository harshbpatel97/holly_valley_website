import React, { useState } from 'react';
import { getImagePath } from '../utils/imageUtils';
import './Services.css';

const Services = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const services = [
    {
      id: 'uhaul',
      title: 'U-Haul',
      content: (
        <div>
          <div className="img-services">
            <img src={getImagePath("/images/storeImages/04_uhaul_services.jpg")} alt="uhaul-service-img" />
          </div>
          <p>Holly Valley is proud to be a U-Haul Neighborhood Dealer, offering convenient truck and trailer rental services to our community.</p>
          <p><strong>Services Available:</strong></p>
          <ul className="list-elements">
            <li>Moving Trucks</li>
            <li>Trailers & Towing</li>
            <li>Moving Supplies</li>
            <li>One-Way and In-Town Rentals</li>
          </ul>
          <p><strong>Office Hours:</strong></p>
          <ul className="list-elements">
            <li>Monday - Saturday: 8:00 AM - 6:00 PM</li>
            <li>Sunday: 11:00 AM - 6:00 PM</li>
          </ul>
          <p>For reservations, rates, and more detailed information, please visit our U-Haul location page:</p>
          <p><a href="https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/" target="_blank" rel="noopener noreferrer" style={{color: '#41A699', fontWeight: 'bold'}}>Book U-Haul Services Online</a></p>
        </div>
      )
    },
    {
      id: 'payments',
      title: 'Accepted Forms of Payments',
      content: (
        <div>
          <div className="img-services">
            <img src={getImagePath("/images/misc/payment-service.png")} alt="payment-service-img" />
          </div>
          <p>Holly Valley accepts the most commonly used forms of payments such as:</p>
          <ul className="list-elements">
            <li>Cash</li>
            <li>MasterCard</li>
            <li>VisaCard</li>
            <li>Gift-Cards</li>
            <li>Credit</li>
            <li>Debit</li>
            <li>EBT</li>
          </ul>
        </div>
      )
    },
    {
      id: 'atm',
      title: 'ATM',
      content: (
        <div>
          <div className="img-services">
            <img src={getImagePath("/images/misc/atm-service.png")} alt="atm-service-img" />
          </div>
          <p>The store also provides the ATM service at the minimum transaction fee
            and most of the credit and debit cards are accepted. ATM machine is rented
            by a well-reputed company in order to honor customer's privacy of identity and
            assets.</p>
        </div>
      )
    },
    {
      id: 'lottery',
      title: 'NC Lottery',
      content: (
        <div>
          <div className="img-services">
            <img src={getImagePath("/images/misc/lottery-service.png")} alt="lottery-services-pic" />
          </div>
          <p>Holly Valley is an authorized NC Lottery retailer, offering various lottery games and services in compliance with North Carolina lottery regulations.</p>
          <p><strong>Services Available:</strong></p>
          <ul className="list-elements">
            <li>NC Lottery tickets ($1 to $50)</li>
            <li>Online lottery games (Mega Millions, Powerball, Cash 5)</li>
            <li>Instant scratch-off tickets</li>
          </ul>
          <p><strong>Age Requirements:</strong></p>
          <ul className="list-elements">
            <li>Must be 18 years or older to purchase lottery tickets</li>
            <li>Valid government-issued photo ID required</li>
            <li>No exceptions to age requirements</li>
          </ul>
          <p><strong>Important Legal Information:</strong></p>
          <ul className="list-elements">
            <li>Holly Valley strictly complies with NC Lottery guidelines</li>
            <li>All lottery sales are subject to verification</li>
            <li>Winners must claim prizes according to NC Lottery rules</li>
            <li>Lottery games are for entertainment purposes only</li>
          </ul>
          <div className="responsible-gambling">
            <p><strong>Responsible Gambling:</strong></p>
            <ul className="list-elements">
              <li>Set a budget and stick to it</li>
              <li>Never play more than you can afford to lose</li>
              <li>Don't chase losses</li>
              <li>If you have a gambling problem, call 1-800-522-4700</li>
            </ul>
          </div>
          <p><strong>NC Lottery Compliance:</strong> Holly Valley maintains strict compliance with all NC Lottery regulations and guidelines. 
          All lottery transactions are monitored and recorded as required by law.</p>
          <p><small>For more information about NC Lottery rules and regulations, visit <a href="https://www.nclottery.com" target="_blank" rel="noopener noreferrer">nclottery.com</a></small></p>
        </div>
      )
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="services">
      <div className="legal-disclaimer">
        <p><strong>LEGAL NOTICE:</strong> This website displays lottery services for informational purposes only. 
        All lottery products and services are subject to age verification and compliance with NC Lottery regulations. 
        Lottery games are for adults 18+ only. Please play responsibly.</p>
      </div>
      
      <div className="subsection">
        <h2 className="subsection-heading" id="services">SERVICES</h2>
        <div className="subsection-content" id="subheader-content">
          <p>Holly Valley offers a variety of services such as Gas service, ATM, and lottery. Details of each service
            mentioned below.</p>
          <p className="age-notice"><strong>Age Restricted Services:</strong> Lottery services require valid ID and are for adults 18+ only. Please play responsibly.</p>
        </div>
      </div>

      <div className="subsection">
        {services.map((service) => (
          <div key={service.id} className="accordion">
            <h3 
              className={`accordion-header ${activeAccordion === service.id ? 'active' : ''}`}
              onClick={() => toggleAccordion(service.id)}
            >
              {service.title}
            </h3>
            <div className={`panel ${activeAccordion === service.id ? 'active' : ''}`}>
              <div className="textAlignLeft">
                {service.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services; 