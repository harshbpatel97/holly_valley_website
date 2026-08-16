import { getLocalResponse, callGeminiDirect, STORE_INFO } from './chatKnowledge';

describe('ChatBot Knowledge Engine', () => {
  test('returns store hours and schedule for hours query', () => {
    const res = getLocalResponse('What are your store hours today?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('Weekly Store Schedule');
    expect(res.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: '📞 Call Store' }),
      ])
    );
  });

  test('returns U-Haul rental info and links', () => {
    const res = getLocalResponse('How do I rent a U-Haul truck?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('Authorized U-Haul Neighborhood Dealer');
    expect(res.actions.some((a) => a.url === STORE_INFO.uhaulUrl)).toBe(true);
  });

  test('returns EBT and payment methods', () => {
    const res = getLocalResponse('Do you take EBT or Apple Pay?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('EBT / SNAP');
    expect(res.text).toContain('Apple Pay');
  });

  test('returns NC Lottery rules and 18+ age limit', () => {
    const res = getLocalResponse('Tell me about NC lottery tickets and Powerball');
    expect(res).not.toBeNull();
    expect(res.text).toContain('18 years old');
    expect(res.text).toContain('Powerball');
  });

  test('returns address and map directions', () => {
    const res = getLocalResponse('Where are you located? Give me directions');
    expect(res).not.toBeNull();
    expect(res.text).toContain(STORE_INFO.address);
    expect(res.actions.some((a) => a.url === STORE_INFO.googleMapsUrl)).toBe(true);
  });

  test('callGeminiDirect sends multi-turn history and message to Gemini API', async () => {
    const mockReply = 'We have cold Monster and Red Bull drinks in stock!';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: mockReply }],
            },
          },
        ],
      }),
    });

    const history = [
      { sender: 'user', text: 'Do you carry energy drinks?' },
      { sender: 'assistant', text: 'Yes, we carry a wide variety of energy drinks.' },
    ];

    const result = await callGeminiDirect(
      'Which brands do you have?',
      history,
      'Open Now',
      'test-api-key'
    );

    expect(result).toBe(mockReply);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const calledBody = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(calledBody.contents.length).toBe(3); // 2 history items + 1 current message
    expect(calledBody.contents[0].role).toBe('user');
    expect(calledBody.contents[1].role).toBe('model');
    expect(calledBody.contents[2].role).toBe('user');
    expect(calledBody.generationConfig.temperature).toBe(0.7);
  });
});
