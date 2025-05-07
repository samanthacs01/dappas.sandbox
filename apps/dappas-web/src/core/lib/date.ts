import { TZDate } from '@date-fns/tz';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { formatInTimeZone, toDate, toZonedTime } from 'date-fns-tz';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const dateFormat = 'MM/dd/yyyy';
export const dateFilterFormat = 'yyyy-MM-dd';

export const getRemainingMonths = (): { label: string; value: string }[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  return months.slice(currentMonth).map((month, index) => ({
    label: month,
    value: (currentMonth + index + 1).toString(),
  }));
};

export const getAllMonths = (): { label: string; value: string }[] =>
  months.map((month, index) => ({
    label: month,
    value: (index + 1).toString(),
  }));

export const formatDateOrString = (
  dateValue: Date | string,
  dateFormatOverride?: string
): string => {
  try {
    if (dateValue instanceof Date) {
      return format(dateValue, dateFormatOverride ?? dateFormat);
    } else {
      return dateValue;
    }
  } catch {
    return dateValue.toString();
  }
};

export const getMonthByNumber = (monthNumber: number): string => {
  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1] ?? '';
  } else {
    return '';
  }
};

export function getCurrentMonthDateRange(): { from: Date; to: Date } {
  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);

  return { from, to };
}

export const parseUtcDate = (dateString: string | Date): Date | string => {
  try {
    const parsedDate = toZonedTime(
      toDate(new Date(dateString), { timeZone: 'UTC' }),
      'UTC'
    );

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    } else {
      parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
    }
  } catch {
    return dateString;
  }
};

export function formatDateUTC(date: Date | string, format?: string): string {
  try {
    if (!date) throw new Error('Invalid date');
    return formatInTimeZone(new Date(date), 'UTC', format ?? dateFormat);
  } catch {
    return date ? date.toString() : '';
  }
}

export function parseToTimezone(date: Date, timeZone: string): Date {
  try {
    if (!date || !(date instanceof Date)) throw new Error('Invalid date');
    return new TZDate(new Date(date), timeZone);
  } catch {
    return new Date();
  }
}
