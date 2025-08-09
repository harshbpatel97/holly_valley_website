import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function sendPageView(measurementId, path) {
  if (!window.gtag || !measurementId) return;
  window.gtag('config', measurementId, {
    page_path: path,
  });
}

const GoogleAnalytics = ({ measurementId }) => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search + location.hash;
    sendPageView(measurementId, pagePath);
  }, [location.pathname, location.search, location.hash, measurementId]);

  return null;
};

export default GoogleAnalytics; 