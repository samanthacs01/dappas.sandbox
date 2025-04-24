import { useEffect, useState } from 'react';
import { DateRange, PropsRange } from 'react-day-picker';
import useUrlParams from './use-url-params';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { UTCDate } from '@date-fns/utc';
import { dateFilterFormat } from '../lib/date';

export const useSelectDataRange = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { updateSearchParams } = useUrlParams();

  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  useEffect(() => {
    if (from && to) {
      setDateRange({
        from: new UTCDate(from),
        to: new UTCDate(to),
      });
    }
  }, []);

  useEffect(() => {
    if (!from && !to) {
      setDateRange(undefined);
    }
  }, [from, to]);

  const selectDateRange: PropsRange['onSelect'] = (range) => {
    if (range) {
      setDateRange(range);
      if (range?.from && range?.to) {
        updateSearchParams({
          from: {
            action: 'set',
            value: format(range?.from, dateFilterFormat),
          },
          to: { action: 'set', value: format(range?.to, dateFilterFormat) },
        });
      }
    } else {
      setDateRange(undefined);
      updateSearchParams({
        from: {
          action: 'delete',
          value: '',
        },
        to: { action: 'delete', value: '' },
      });
    }
  };

  return { selectDateRange, dateRange };
};
