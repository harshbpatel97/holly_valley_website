/**
 * Google Analytics GA4 Event Dispatcher
 * Reliably pushes events to Google Tag Manager / Google Analytics dataLayer
 * Supports real-time debug_mode and rich event tracking for the AI Chatbot and store pages.
 */

/**
 * Checks if debug mode is active (localhost, development, or via ?debug_ga=true)
 */
export const isGaDebugMode = () => {
  if (typeof window === 'undefined') return false;

  try {
    if (process.env.NODE_ENV === 'development') return true;
    if (window.__GA_DEBUG__ === true) return true;
    if (window.location) {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('debug_ga') === 'true') return true;
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem('debug_ga') === 'true') {
      return true;
    }
  } catch (err) {
    // Ignore storage/security errors
  }
  return false;
};

/**
 * Core GA4 Event Tracking function
 * @param {string} eventName - GA4 event name (letters, numbers, underscores)
 * @param {Object} params - Event parameters
 */
export const track = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;

  try {
    const debug = isGaDebugMode();
    const finalParams = {
      ...params,
      ...(debug ? { debug_mode: true } : {}),
    };

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Log to console in debug mode for immediate developer visibility
    if (debug && typeof console !== 'undefined' && console.log) {
      console.log(
        `%c📊 [GA4 Event] ${eventName}`,
        'color: #0D9488; font-weight: bold; background: #F0FDFA; padding: 2px 6px; border-radius: 4px; border: 1px solid #99F6E4;',
        finalParams
      );
    }

    // If gtag is available, use standard gtag call
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, finalParams);
    } else {
      // Fallback: push standard arguments object to dataLayer for gtag initialization
      window.dataLayer.push(['event', eventName, finalParams]);
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

// ============================================================================
// Specialized Chatbot Analytics Tracking Helpers
// ============================================================================

/**
 * Track chatbot widget opening
 */
export const trackChatbotOpen = (source = 'fab') => {
  track('chatbot_opened', {
    event_category: 'Chatbot',
    event_label: 'Chat Widget Opened',
    open_source: source,
  });
};

/**
 * Track chatbot widget closing
 */
export const trackChatbotClose = () => {
  track('chatbot_closed', {
    event_category: 'Chatbot',
    event_label: 'Chat Widget Closed',
  });
};

/**
 * Track chatbot user query / prompt submission
 */
export const trackChatbotQuery = ({
  query = '',
  queryType = 'user_input',
  source = 'unknown',
  topic = 'general',
  promptLength = 0,
}) => {
  const sanitizedQuery = (query || '').slice(0, 100);
  track('chatbot_query', {
    event_category: 'Chatbot',
    event_label: topic || sanitizedQuery || 'User Query',
    query_topic: topic,
    query_type: queryType,
    source: source,
    prompt_length: promptLength || sanitizedQuery.length,
    search_term: sanitizedQuery,
  });
};

/**
 * Track chatbot assistant response generation
 */
export const trackChatbotResponse = ({
  responseSource = 'local_knowledge',
  responseType = 'info',
  topic = 'general',
  responseLength = 0,
  hasCta = false,
}) => {
  track('chatbot_response', {
    event_category: 'Chatbot',
    event_label: topic || responseType || 'Bot Response',
    response_source: responseSource,
    response_type: responseType,
    response_topic: topic,
    response_length: responseLength,
    has_cta: hasCta,
  });
};

/**
 * Track click on an action button or quick action chip in the chatbot
 */
export const trackChatbotActionClick = ({
  actionLabel = '',
  actionType = 'button',
  actionId = '',
  destinationUrl = '',
}) => {
  track('chatbot_action_click', {
    event_category: 'Chatbot',
    event_label: actionLabel || actionId || 'Action Click',
    action_label: actionLabel,
    action_type: actionType,
    action_id: actionId,
    ...(destinationUrl ? { url: destinationUrl } : {}),
  });
};

/**
 * Track high-value business leads generated from the chatbot (Phone calls, Directions, U-Haul bookings)
 */
export const trackChatbotLead = (leadType, details = {}) => {
  track(`chatbot_lead_${leadType}`, {
    event_category: 'Chatbot',
    event_label: `Chatbot Lead: ${leadType}`,
    lead_type: leadType,
    ...details,
  });
};

/**
 * Track session rate limiting
 */
export const trackChatbotRateLimited = (sessionCount = 0) => {
  track('chatbot_rate_limited', {
    event_category: 'Chatbot',
    event_label: 'Chatbot Rate Limited',
    session_count: sessionCount,
  });
};

/**
 * Track clearing chat history
 */
export const trackChatbotClear = () => {
  track('chatbot_clear_history', {
    event_category: 'Chatbot',
    event_label: 'Chat History Cleared',
  });
};

export default track;