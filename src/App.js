import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';
import AgeVerification from './components/AgeVerification';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Services from './components/Services';
import Products from './components/Products';
import Contact from './components/Contact';
import Signage from './components/Signage';
import SignageAccessDenied from './components/SignageAccessDenied';
import GoogleAnalytics from './components/GoogleAnalytics';
import './App.css';

// Signage route component with token authentication
// Must be inside Router context (used in AppContent)
function SignageRoute() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const requiredToken = process.env.REACT_APP_SIGNAGE_TOKEN;

  // If no token is configured, allow access (for development/fallback)
  if (!requiredToken) {
    return <Signage />;
  }

  // Check if token is provided and matches
  if (!token || token !== requiredToken) {
    return <SignageAccessDenied />;
  }

  // Token is valid, show signage
  return <Signage />;
}

function AppContent() {
  const location = useLocation();
  const isSignagePage = location.pathname === '/signage';
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Skip age verification for signage page
    if (isSignagePage) {
      setShowVerification(false);
      return;
    }
    
    // Check if user has already verified their age
    const verified = sessionStorage.getItem('advertOnce') === 'true';
    if (!verified) {
      setShowVerification(true);
    }
  }, [isSignagePage]);

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

  // Render signage page with authentication check
  if (isSignagePage) {
    return <SignageRoute />;
  }

  return (
    <>
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
                <Route path="/signage" element={<Signage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </>
        )}
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
