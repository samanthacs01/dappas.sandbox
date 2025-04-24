import { formatDateUTC } from '@/core/lib/date';

interface CurrencyFormatOptions {
  amount: number;
  options?: Intl.NumberFormatOptions;
  showK?: boolean;
}

export const fCurrency = ({
  amount,
  options = { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' },
}: CurrencyFormatOptions) => {
  return new Intl.NumberFormat('en-US', {
    ...options,
  }).format(amount);
};

export const fPercent = (value: number, options?: Intl.NumberFormatOptions) => {
  if (value === null || value === undefined || value === 0) {
    return '0%';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    ...options,
  }).format(value / 100);
};

export const valueFormatter = (
  value: number | string,
  valueFormat: 'number' | 'currency' | 'percentage' | 'date',
  options?: Intl.NumberFormatOptions,
): string => {
  try {
    const numericValue = +value;

    switch (valueFormat) {
      case 'percentage':
        return fPercent(+value);
      case 'currency':
        return fCurrency({
          amount: numericValue,
          options,
        });
      case 'date': {
        return formatDateUTC(value as string);
      }
      case 'number':
      default:
        return new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 2,
          ...options,
        })
          .format(+value)
          .toString();
    }
  } catch (e) {
    return value ? value.toString() : '';
  }
};
