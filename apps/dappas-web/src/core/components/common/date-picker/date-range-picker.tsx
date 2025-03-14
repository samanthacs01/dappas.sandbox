'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { DateRange, PropsRange } from 'react-day-picker';

import { Button } from '@/core/components/ui/button';
import { Calendar } from '@/core/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { cn } from '@/core/lib/utils';

export type DateRangePickerProps = {
  dateRange?: DateRange;
  onSelectRange?: PropsRange['onSelect'];
} & React.HTMLAttributes<HTMLDivElement>;

export const DateRangePicker: FunctionComponent<DateRangePickerProps> = ({
  className,
  dateRange,
  onSelectRange,
  ...rest
}) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (dateRange?.from && dateRange.to && dateRange?.from !== dateRange.to) {
      setOpen(false);
    }
  }, [dateRange]);

  return (
    <div className={cn('grid gap-2', className)} {...rest}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-card">
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'lg:w-52 2xl:w-80	max-w-60 justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
            )}
            data-cy="date-range-picker"
          >
            <CalendarIcon />
            <span className="truncate inline-block min-w-0">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Start date - End date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onSelectRange}
            numberOfMonths={2}
            data-cy="date-range-calendar"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
