import { STORE_SCHEDULE, getStoreStatus } from './utils/storeHours';

describe('App & Store Utilities', () => {
  test('store schedule is defined for 7 days', () => {
    expect(STORE_SCHEDULE).toHaveLength(7);
  });

  test('getStoreStatus returns store status object', () => {
    const status = getStoreStatus();
    expect(status).toHaveProperty('isOpen');
    expect(status).toHaveProperty('statusText');
    expect(status).toHaveProperty('todaySchedule');
  });
});
