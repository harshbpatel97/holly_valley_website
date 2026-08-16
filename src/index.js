import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import './index.css';
import App from './App';
import theme from './theme';
import reportWebVitals from './reportWebVitals';

// Google Analytics runtime injection
const GA_ID = process.env.REACT_APP_GA_ID;

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  if (GA_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: true });
  }
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
