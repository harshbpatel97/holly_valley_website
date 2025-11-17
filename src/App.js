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
  const location = useLocation();
  const token = searchParams.get('token');
  const requiredToken = process.env.REACT_APP_SIGNAGE_TOKEN;
  const measurementId = process.env.REACT_APP_GA_ID;

  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    const trackSignageAccess = async () => {
      // Track page view for signage page
      const pagePath = location.pathname + location.search + location.hash;
      window.gtag('config', measurementId, {
        page_path: pagePath,
      });

      // Get IP address
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        // IP fetch failed, continue without IP
      }

      // Track signage access attempt
      const hasToken = !!token;
      const isValidToken = token && token === requiredToken;

      const baseParams = {
        ...(ipAddress && { ip_address: ipAddress }),
      };

      if (!requiredToken) {
        // No token configured - track open access
        window.gtag('event', 'signage_access', {
          event_category: 'Security',
          event_label: 'open_access',
          has_token: false,
          token_configured: false,
          access_granted: true,
          ...baseParams,
        });
      } else if (isValidToken) {
        // Valid token - track successful access
        window.gtag('event', 'signage_access', {
          event_category: 'Security',
          event_label: 'access_granted',
          has_token: true,
          token_valid: true,
          access_granted: true,
          ...baseParams,
        });
      } else {
        // Invalid or missing token - track denied access
        window.gtag('event', 'signage_access_denied', {
          event_category: 'Security',
          event_label: 'access_denied',
          has_token: hasToken,
          token_valid: false,
          access_granted: false,
          reason: hasToken ? 'invalid_token' : 'no_token',
          ...baseParams,
        });
      }
    };

    trackSignageAccess();
  }, [location.pathname, location.search, measurementId, token, requiredToken]);

  // If no token is configured, allow access (for development/fallback)
  if (!requiredToken) {
    return <Signage />;
  }

  // Check if token is provided and matches
  if (!token || token !== requiredToken) {
    return <SignageAccessDenied tokenProvided={!!token} />;
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
