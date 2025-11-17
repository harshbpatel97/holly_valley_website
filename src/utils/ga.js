// Cache IP address to avoid multiple API calls
let cachedIP = null;
let ipFetchPromise = null;

/**
 * Fetch user's IP address using a public API
 * Caches the result to avoid repeated API calls
 */
export const getUserIP = async () => {
  // Return cached IP if available
  if (cachedIP) {
    return cachedIP;
  }

  // Return existing promise if fetch is in progress
  if (ipFetchPromise) {
    return ipFetchPromise;
  }

  // Fetch IP address
  ipFetchPromise = fetch('https://api.ipify.org?format=json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch IP');
      }
      return response.json();
    })
    .then(data => {
      cachedIP = data.ip;
      return cachedIP;
    })
    .catch(error => {
      // If primary service fails, try backup
      return fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          cachedIP = data.ip;
          return cachedIP;
        })
        .catch(() => {
          // If both fail, return null
          return null;
        });
    });

  return ipFetchPromise;
};

export const track = async (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    // Add IP address to event parameters if available
    const ipAddress = await getUserIP();
    const eventParams = {
      ...params,
      ...(ipAddress && { ip_address: ipAddress }),
    };
    
    window.gtag('event', eventName, eventParams);
  } catch (err) {
    // no-op in case analytics is blocked
  }
};

/**
 * Track event synchronously (without IP address)
 * Use when IP is not needed or already included
 */
export const trackSync = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    // no-op in case analytics is blocked
  }
}; 