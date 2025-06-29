import React from 'react';
import './AgeVerification.css';

const AgeVerification = ({ onVerify, onExit }) => {
  return (
    <div className="age-verification">
      <div className="overlay-verify"></div>
      <main>
        <article className="box">
          <div className="box-right">
            <p><strong>Age Restricted Content Warning</strong></p>
            <p>This website contains content related to tobacco products, alcohol, lottery services, and age-restricted items which are regulated by federal and state laws.</p>
            <h3>Age Verification Required</h3>
            <p>By clicking "ENTER", I certify that:</p>
            <ul className="age-requirements">
              <li>I am at least 21 years of age (for tobacco and alcohol products)</li>
              <li>I am at least 18 years of age (for lottery services)</li>
              <li>I understand that these products/services are for adults only</li>
              <li>I will comply with all applicable laws and regulations</li>
              <li>I acknowledge that this website is for informational purposes only</li>
              <li>I understand that gambling can be addictive and will gamble responsibly</li>
            </ul>
            <p><small>Holly Valley complies with all federal and state regulations regarding age-restricted products and lottery services.</small></p>

            <button className="btn btn-alpha" onClick={onVerify}>
              ENTER (21+ ONLY)
            </button>

            <p className="decor-line"><span>Or</span></p>

            <button className="btn btn-beta" onClick={onExit}>
              EXIT
            </button>

            <small>Always enjoy responsibly. Tobacco and alcohol products are for adults 21+ only.</small>
          </div>
        </article>
      </main>
    </div>
  );
};

export default AgeVerification; 