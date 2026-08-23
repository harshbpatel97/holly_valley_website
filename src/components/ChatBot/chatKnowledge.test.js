import { getLocalResponse } from './chatKnowledge';

describe('chatKnowledge - getLocalResponse', () => {
  test('returns U-Haul info for truck queries', () => {
    const res = getLocalResponse('I need 14 ft truck do you have it');
    expect(res).not.toBeNull();
    expect(res.text).toContain('Authorized U-Haul Neighborhood Dealer');
    expect(res.text).toContain('Moving Trucks');
    expect(res.actions.length).toBeGreaterThan(0);
  });

  test('returns store hours for open/hours queries', () => {
    const res = getLocalResponse('What time do you close today?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('Weekly Store Schedule');
  });

  test('returns payment info for EBT / Apple Pay queries', () => {
    const res = getLocalResponse('Do you accept EBT and Apple Pay?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('EBT / SNAP');
    expect(res.text).toContain('Apple Pay');
  });

  test('returns lottery info for scratch tickets', () => {
    const res = getLocalResponse('Can I buy lottery scratch tickets?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('NC Lottery');
    expect(res.text).toContain('18 years old');
  });

  test('returns age policies for beer and tobacco', () => {
    const res = getLocalResponse('How old to buy beer or vape?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('21+');
  });

  test('returns location for directions queries', () => {
    const res = getLocalResponse('Where are you located?');
    expect(res).not.toBeNull();
    expect(res.text).toContain('2730 NC Hwy 18 S');
  });
});
