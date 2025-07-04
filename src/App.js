import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AgeVerification from './components/AgeVerification';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Services from './components/Services';
import Products from './components/Products';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const verified = sessionStorage.getItem('advertOnce') === 'true';
    if (!verified) {
      setShowVerification(true);
    }
  }, []);

  const handleAgeVerification = () => {
    sessionStorage.setItem('advertOnce', 'true');
    setShowVerification(false);
  };

  const handleExit = () => {
    sessionStorage.setItem('advertOnce', '');
    setShowVerification(true);
  };

  return (
    <Router>
      <div className="App">
        {showVerification ? (
          <AgeVerification onVerify={handleAgeVerification} onExit={handleExit} />
        ) : (
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/products" element={<Products />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
