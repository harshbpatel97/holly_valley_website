import React, { useState } from 'react';
import './Services.css';

const Services = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const services = [
    {
      id: 'payments',
      title: 'Accepted Forms of Payments',
      content: (
        <div>
          <div className="img-services">
            <img src="/images/payment-service.png" alt="payment-service-img" />
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
            <img src="/images/atm-service.png" alt="atm-service-img" />
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
            <img src="/images/lottery-service.png" alt="lottery-services-pic" />
          </div>
          <p>Holly Valley has various lottery games installed within the store where
            customer can come and play the games.</p>
          <p>Store also has the NC Lottery tickets ranging from $1 to $30 as well as online tickets such as Mega-millions,
            Cash5, Powerball, etc. Moreover, store is proud to announce that there have
            been customers who have won $10,000 to $500 while playing lottery games here.</p>
          <p>Holly Valley strictly complies with guidelines established by the NC Lottery and follows
            minimum age of 21 years in order to purchase the lottery ticket.</p>
        </div>
      )
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="services">
      <div className="subsection">
        <h2 className="subsection-heading" id="services">SERVICES</h2>
        <div className="subsection-content" id="subheader-content">
          <div className="services-logo">
            <img src="/images/services-logo.png" alt="services-logo" />
          </div>
          <p>Holly Valley offers a variety of services such as Gas service, ATM, and lottery. Details of each service
            mentioned below.</p>
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