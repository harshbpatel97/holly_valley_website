import { getLocalResponse, STORE_INFO } from './chatKnowledge';

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
});
