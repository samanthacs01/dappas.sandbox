import { Button } from '@/core/components/ui/button';
import { Calendar, CalendarProps } from '@/core/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { formatDateUTC, parseToTimezone } from '@/core/lib/date';
import { cn } from '@/core/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { PropsSingle } from 'react-day-picker';

type DatePickerProps = Omit<CalendarProps, 'selected'> & {
  value: Date;
  onChange: PropsSingle['onSelect'];
  timezone?: string;
};

const DatePicker = ({
  value,
  onChange,
  timezone = 'UTC',
  ...others
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {value ? formatDateUTC(value) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          {...others}
          mode="single"
          selected={value ? parseToTimezone(value, timezone) : undefined}
          onSelect={onChange}
          defaultMonth={parseToTimezone(value, timezone) ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
