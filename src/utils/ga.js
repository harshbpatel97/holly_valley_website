export const track = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    // no-op in case analytics is blocked
  }
}; 