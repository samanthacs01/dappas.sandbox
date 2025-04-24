'use client';

import { DateRangePicker } from '@/core/components/common/date-picker';
import { useSelectDataRange } from '@/core/hooks/use-select-date-range';
import { FC } from 'react';

const DateRangeFilter: FC = () => {
  const { dateRange, selectDateRange } = useSelectDataRange();

  return (
    <DateRangePicker dateRange={dateRange} onSelectRange={selectDateRange} />
  );
};

export default DateRangeFilter;
