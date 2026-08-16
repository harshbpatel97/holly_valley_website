/**
 * Google Analytics GA4 Event Dispatcher
 * Reliably pushes events to Google Tag Manager / Google Analytics dataLayer
 */

export const track = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  try {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // If gtag is available, use standard gtag call
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else {
      // Fallback: directly push event to dataLayer
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    // Silently continue if ad blockers are active
  }
};

/**
 * Synchronous track helper (alias for backwards compatibility)
 */
export const trackSync = (eventName, params = {}) => {
  track(eventName, params);
};

export default track;