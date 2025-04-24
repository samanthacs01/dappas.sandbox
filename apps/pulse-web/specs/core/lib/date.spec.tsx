import {
  dateFormat,
  formatDateOrString,
  formatDateUTC,
  getCurrentMonthDateRange,
  getMonthByNumber,
  getRemainingMonths,
  months,
  parseToTimezone,
  parseUtcDate,
} from '@/core/lib/date';
import { endOfMonth, format, startOfMonth } from 'date-fns';

describe('Test Date Utils Functions', () => {
  // parseUtcDate function
  it('Test parseUtcDate with a good formatted date', async () => {
    const date = parseUtcDate('2021-01-01T00:00:00Z') as Date;
    expect(date).toBeInstanceOf(Date);
    expect(date.toDateString()).toBe('Fri Jan 01 2021');
  });
  it('Test parseUtcDate with a bad formatted date', async () => {
    const date1 = parseUtcDate('01-01-2021') as Date;
    expect(date1).toBeInstanceOf(Date);
    expect(date1.toDateString()).toBe('Fri Jan 01 2021');
  });

  it('Test parseUtcDate with long date format', async () => {
    const date1 = parseUtcDate('01 Jan 2021') as Date;
    expect(date1).toBeInstanceOf(Date);
    expect(date1.toDateString()).toBe('Fri Jan 01 2021');
  });

  it('Test parseUtcDate with long date format v2', async () => {
    const date1 = parseUtcDate('01 January 2021') as Date;
    expect(date1).toBeInstanceOf(Date);
    expect(date1.toDateString()).toBe('Fri Jan 01 2021');
  });

  it('Test parseUtcDate with a hour left for the other day', async () => {
    const date2 = parseUtcDate('2021-01-01T23:00:00Z') as Date;
    expect(date2).toBeInstanceOf(Date);
    expect(date2.toDateString()).toBe('Fri Jan 01 2021');
  });

  // formatDateUTC function
  it('Test formatDateUTC with a utc string date', async () => {
    const date = formatDateUTC('2021-01-01T23:00:00Z');
    expect(date).toBe('01/01/2021');
  });

  it('Test formatDateUTC with a utc  date', async () => {
    const date = formatDateUTC(new Date('2021-01-01T23:00:00Z'));
    expect(date).toBe('01/01/2021');
  });

  it('Test formatDateUTC with a bad formatted date', async () => {
    const date = formatDateUTC('01-01-2021');
    expect(date).toBe('01/01/2021');
  });

  it('Test formatDateUTC with other format', async () => {
    const date = formatDateUTC('01/30/2021', 'dd/MM/yyyy');
    expect(date).toBe('30/01/2021');
  });

  it('Test formatDateUTC with long date format v2', async () => {
    const date1 = formatDateUTC('01 January 2021');
    expect(date1).toBe('01/01/2021');
  });

  test('getRemainingMonths returns correct months', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const remainingMonths = getRemainingMonths();

    expect(remainingMonths.length).toBe(12 - currentMonth);
    expect(remainingMonths[0].label).toBe(months[currentMonth]);
  });

  test('formatDateOrString formats date correctly', () => {
    const date = new Date(2023, 0, 1);
    const formattedDate = formatDateOrString(date);
    expect(formattedDate).toBe(format(date, dateFormat));

    const dateString = '01/01/2023';
    expect(formatDateOrString(dateString)).toBe(dateString);
  });

  test('getMonthByNumber returns correct month name', () => {
    expect(getMonthByNumber(1)).toBe('January');
    expect(getMonthByNumber(12)).toBe('December');
    expect(getMonthByNumber(0)).toBe('');
    expect(getMonthByNumber(13)).toBe('');
  });

  test('getCurrentMonthDateRange returns correct date range', () => {
    const { from, to } = getCurrentMonthDateRange();
    const now = new Date();

    expect(from).toEqual(startOfMonth(now));
    expect(to).toEqual(endOfMonth(now));
  });

  // formatToLocalTimezone function
  // The jest local timezone is America/New_York
  it('Test formatToLocalTimezone with a UTC date string in default format', async () => {
    const date = parseToTimezone(
      new Date('2021-01-01T00:00:00Z'),
      'America/New_York',
    );

    expect(
      date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
    ).toBe(
      new Date('2021-01-01T00:00:00Z').toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
    );
  });

  it('Test formatToLocalTimezone with a UTC date string in Japan timezone', async () => {
    const date = parseToTimezone(
      new Date('2021-01-01T00:00:00Z'),
      'Asia/Tokyo',
    );
    const localDate = new Date('2021-01-01T00:00:00Z').toLocaleString('en-US', {
      timeZone: 'Asia/Tokyo',
    });
    expect(
      date.toLocaleString('en-US', {
        timeZone: 'Asia/Tokyo',
      }),
    ).toBe(localDate);
  });

  it('Test formatToLocalTimezone with an invalid date', async () => {
    const date = parseToTimezone(new Date('invalid-date'), 'America/New_York');
    expect(date.toLocaleString()).toBe('Invalid Date');
  });

  it('Test formatToLocalTimezone with an string', async () => {
    const date = parseToTimezone(
      'Invalid Date' as unknown as Date,
      'America/New_York',
    );
    expect(date.toLocaleString()).toBe(new Date().toLocaleString());
  });
});
