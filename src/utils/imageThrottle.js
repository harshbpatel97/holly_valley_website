/**
 * Global image loading throttle utility
 * Allows concurrent image loading with a small delay to prevent rate limiting
 * Uses a sliding window approach: allows up to MAX_CONCURRENT loads with MIN_DELAY_MS between starts
 */

let activeLoads = 0;
let loadQueue = [];
let lastLoadStartTime = 0;

const MAX_CONCURRENT = 5; // Allow up to 5 images loading simultaneously
const MIN_DELAY_MS = 100; // Minimum 100ms delay between starting new loads (prevents 429 errors)

/**
 * Process the load queue with concurrent loading
 */
const processQueue = () => {
  // Process queue while we have capacity and items in queue
  while (activeLoads < MAX_CONCURRENT && loadQueue.length > 0) {
    const { loadFunction, resolve } = loadQueue.shift();
    
    // Calculate delay based on time since last load start
    const now = Date.now();
    const timeSinceLastStart = now - lastLoadStartTime;
    const delay = Math.max(0, MIN_DELAY_MS - timeSinceLastStart);

    activeLoads++;
    lastLoadStartTime = now + delay;

    // Start the load after the delay
    // Note: activeLoads is intentionally accessed from closure - it's a module-level variable
    // eslint-disable-next-line no-loop-func
    setTimeout(() => {
      try {
        // Execute the load function
        loadFunction();
      } catch (error) {
        console.error('[ImageQueue] Error executing load function:', error);
      }
      
      // Mark this load as complete
      activeLoads--;
      resolve();
      
      // Try to process more items from the queue
      processQueue();
    }, delay);
  }
};

/**
 * Add an image load to the global queue
 * @param {Function} loadFunction - Function to call to load the image
 * @returns {Promise} Promise that resolves when the image load is queued (not when it completes)
 */
export const queueImageLoad = (loadFunction) => {
  return new Promise((resolve) => {
    loadQueue.push({ loadFunction, resolve });
    processQueue();
  });
};

