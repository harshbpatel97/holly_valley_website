/**
 * Store Hours Utility for Holly Valley (Moravian Falls, NC - Eastern Time)
 * Schedule:
 * Monday - Saturday: 8:00 AM - 8:00 PM
 * Sunday: 11:00 AM - 7:30 PM
 */

export const STORE_SCHEDULE = [
  { day: 'Sunday', openHour: 11, openMin: 0, closeHour: 19, closeMin: 30, text: '11:00 AM – 7:30 PM', shortDay: 'Sun' },
  { day: 'Monday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Mon' },
  { day: 'Tuesday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Tue' },
  { day: 'Wednesday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Wed' },
  { day: 'Thursday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Thu' },
  { day: 'Friday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Fri' },
  { day: 'Saturday', openHour: 8, openMin: 0, closeHour: 20, closeMin: 0, text: '8:00 AM – 8:00 PM', shortDay: 'Sat' },
];

export const getStoreStatus = () => {
  try {
    // Determine current time in Eastern Time (America/New_York)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    let hour = 0;
    let minute = 0;
    let weekdayShort = '';

    parts.forEach((p) => {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
      if (p.type === 'weekday') weekdayShort = p.value;
    });

    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dayIndex = dayMap[weekdayShort] !== undefined ? dayMap[weekdayShort] : now.getDay();
    const today = STORE_SCHEDULE[dayIndex];

    const currentMinutes = hour * 60 + minute;
    const openMinutes = today.openHour * 60 + today.openMin;
    const closeMinutes = today.closeHour * 60 + today.closeMin;

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    let statusText = '';
    let badgeText = '';

    if (isOpen) {
      const minutesRemaining = closeMinutes - currentMinutes;
      if (minutesRemaining <= 60) {
        statusText = `Open Now • Closes in ${minutesRemaining} mins (${today.text.split('–')[1].trim()})`;
        badgeText = `Closes in ${minutesRemaining}m`;
      } else {
        statusText = `Open Now • Closes at ${today.text.split('–')[1].trim()}`;
        badgeText = 'Open Now';
      }
    } else {
      if (currentMinutes < openMinutes) {
        statusText = `Closed • Opens at ${today.text.split('–')[0].trim()}`;
        badgeText = 'Closed';
      } else {
        const nextDay = STORE_SCHEDULE[(dayIndex + 1) % 7];
        statusText = `Closed • Opens tomorrow at ${nextDay.text.split('–')[0].trim()}`;
        badgeText = 'Closed';
      }
    }

    return {
      isOpen,
      statusText,
      badgeText,
      todaySchedule: today.text,
      currentDayIndex: dayIndex,
      schedule: STORE_SCHEDULE,
    };
  } catch (error) {
    return {
      isOpen: true,
      statusText: 'Open 7 Days a Week',
      badgeText: 'Open',
      todaySchedule: '8:00 AM – 8:00 PM',
      currentDayIndex: 1,
      schedule: STORE_SCHEDULE,
    };
  }
};
