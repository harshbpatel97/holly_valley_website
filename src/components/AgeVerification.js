import React from 'react';
import './AgeVerification.css';

const AgeVerification = ({ onVerify, onExit }) => {
  return (
    <div className="age-verification">
      <div className="overlay-verify"></div>
      <main>
        <article className="box">
          <div className="box-right">
            <p>Website depicts tobacco and other products which are restricted to age limits.</p>
            <h3>Age Verification</h3>
            <p>By clicking enter, I certify that I am over the age of 21 and will comply with the above statement.</p>

            <button className="btn btn-alpha" onClick={onVerify}>
              ENTER
            </button>

            <p className="decor-line"><span>Or</span></p>

            <button className="btn btn-beta" onClick={onExit}>
              EXIT
            </button>

            <small>Always enjoy responsibly.</small>
          </div>
        </article>
      </main>
    </div>
  );
};

export default AgeVerification; 