import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';
import AgeVerification from './components/AgeVerification';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Services from './components/Services';
import Products from './components/Products';
import Contact from './components/Contact';
import GoogleAnalytics from './components/GoogleAnalytics';
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

  const appBg = useColorModeValue('gray.50', 'gray.900');
  const appColor = useColorModeValue('gray.800', 'gray.100');

  const measurementId = process.env.REACT_APP_GA_ID;

  return (
    <Router>
      {measurementId && <GoogleAnalytics measurementId={measurementId} />}
      <Box className="App" bg={appBg} color={appColor} minH="100vh">
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
      </Box>
    </Router>
  );
}

export default App;
