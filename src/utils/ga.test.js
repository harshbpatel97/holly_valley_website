import {
  isGaDebugMode,
  track,
  trackSync,
  trackChatbotOpen,
  trackChatbotClose,
  trackChatbotQuery,
  trackChatbotResponse,
  trackChatbotActionClick,
  trackChatbotLead,
  trackChatbotRateLimited,
  trackChatbotClear,
} from './ga';

describe('Google Analytics (GA4) Dispatcher', () => {
  const originalGtag = window.gtag;
  const originalDataLayer = window.dataLayer;
  const originalLocation = window.location;

  beforeEach(() => {
    window.dataLayer = [];
    window.gtag = jest.fn();
    delete window.__GA_DEBUG__;
  });

  afterEach(() => {
    window.gtag = originalGtag;
    window.dataLayer = originalDataLayer;
  });

  describe('isGaDebugMode', () => {
    it('returns true when window.__GA_DEBUG__ is true', () => {
      window.__GA_DEBUG__ = true;
      expect(isGaDebugMode()).toBe(true);
    });

    it('returns true in development node environment', () => {
      expect(isGaDebugMode()).toBe(true);
    });
  });

  describe('track()', () => {
    it('calls window.gtag with eventName and parameters', () => {
      track('custom_event', { category: 'test', value: 10 });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'custom_event',
        expect.objectContaining({
          category: 'test',
          value: 10,
        })
      );
    });

    it('falls back to dataLayer.push when window.gtag is not a function', () => {
      delete window.gtag;
      track('fallback_event', { key: 'val' });
      expect(window.dataLayer.length).toBe(1);
      expect(window.dataLayer[0]).toEqual([
        'event',
        'fallback_event',
        expect.objectContaining({ key: 'val' }),
      ]);
    });

    it('trackSync works as an alias for track', () => {
      trackSync('sync_event', { sync: true });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'sync_event',
        expect.objectContaining({ sync: true })
      );
    });
  });

  describe('Chatbot Specialized Tracking Helpers', () => {
    it('trackChatbotOpen sends chatbot_opened event', () => {
      trackChatbotOpen('fab');
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_opened',
        expect.objectContaining({
          event_category: 'Chatbot',
          event_label: 'Chat Widget Opened',
          open_source: 'fab',
        })
      );
    });

    it('trackChatbotClose sends chatbot_closed event', () => {
      trackChatbotClose();
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_closed',
        expect.objectContaining({
          event_category: 'Chatbot',
          event_label: 'Chat Widget Closed',
        })
      );
    });

    it('trackChatbotQuery sends chatbot_query with rich metadata', () => {
      trackChatbotQuery({
        query: 'What are your hours today?',
        queryType: 'user_input',
        source: 'local_knowledge',
        topic: 'hours',
        promptLength: 26,
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_query',
        expect.objectContaining({
          event_category: 'Chatbot',
          query_topic: 'hours',
          query_type: 'user_input',
          source: 'local_knowledge',
          search_term: 'What are your hours today?',
        })
      );
    });

    it('trackChatbotResponse sends chatbot_response event', () => {
      trackChatbotResponse({
        responseSource: 'local_knowledge',
        responseType: 'instant_local',
        topic: 'hours',
        responseLength: 150,
        hasCta: true,
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_response',
        expect.objectContaining({
          event_category: 'Chatbot',
          response_source: 'local_knowledge',
          response_type: 'instant_local',
          response_topic: 'hours',
          response_length: 150,
          has_cta: true,
        })
      );
    });

    it('trackChatbotActionClick sends chatbot_action_click event', () => {
      trackChatbotActionClick({
        actionLabel: '📞 Call Store',
        actionType: 'phone_call',
        destinationUrl: 'tel:+13363040094',
      });

      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_action_click',
        expect.objectContaining({
          event_category: 'Chatbot',
          action_label: '📞 Call Store',
          action_type: 'phone_call',
          url: 'tel:+13363040094',
        })
      );
    });

    it('trackChatbotLead sends high-intent conversion lead events', () => {
      trackChatbotLead('phone_call', { phone: '+13363040094' });
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_lead_phone_call',
        expect.objectContaining({
          event_category: 'Chatbot',
          lead_type: 'phone_call',
          phone: '+13363040094',
        })
      );
    });

    it('trackChatbotRateLimited sends chatbot_rate_limited event', () => {
      trackChatbotRateLimited(15);
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_rate_limited',
        expect.objectContaining({
          event_category: 'Chatbot',
          session_count: 15,
        })
      );
    });

    it('trackChatbotClear sends chatbot_clear_history event', () => {
      trackChatbotClear();
      expect(window.gtag).toHaveBeenCalledWith(
        'event',
        'chatbot_clear_history',
        expect.objectContaining({
          event_category: 'Chatbot',
          event_label: 'Chat History Cleared',
        })
      );
    });
  });
});
