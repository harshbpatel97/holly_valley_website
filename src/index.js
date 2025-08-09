import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

// Google Analytics runtime injection
const GA_ID = process.env.REACT_APP_GA_ID;
function injectGoogleAnalytics(measurementId) {
  if (!measurementId) return;
  if (window.gtag) return; // avoid duplicate injection
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(inline);
}

if (typeof window !== 'undefined' && GA_ID) {
  injectGoogleAnalytics(GA_ID);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </ChakraProvider>
);

// Send Web Vitals to GA as events
reportWebVitals((metric) => {
  const gtag = window.gtag;
  if (!gtag || !GA_ID) return;
  const params = {
    value: metric.value,
    metric_id: metric.id,
    metric_delta: metric.delta,
  };
  const eventName = `web_vital_${metric.name.toLowerCase()}`;
  gtag('event', eventName, params);
});
