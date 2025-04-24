import { Button } from '@/core/components/ui/button';
import { Calendar, CalendarProps } from '@/core/components/ui/calendar';
import { Card } from '@/core/components/ui/card';
import { Label } from '@/core/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { TooltipContent } from '@/core/components/ui/tooltip';
import {
  formatDateOrString,
  formatDateUTC,
  parseUtcDate,
} from '@/core/lib/date';
import { cn } from '@/core/lib/utils';
import { ComboBoxOption } from '@/server/types/combo-box';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ComboBox } from '../combo-box';

type Value = Date | Date[] | DateRange | string | undefined;
type Mode = CalendarProps['mode'];

export type DatePickerToggleProps = {
  value: Value;
  onChange?: (_: Value) => void;
  defaultMode: Mode;
  onParseError?: VoidFunction;
  hasError?: boolean;
};

export const DatePickerToggle: FC<DatePickerToggleProps> = ({
  value,
  onChange,
  defaultMode,
  onParseError,
  hasError,
}) => {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [newValue, setNewValue] = useState<Value>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    parseNewValue();
  }, []);

  useEffect(() => {
    applyValue();
  }, [newValue]);

  const parseNewValue = () => {
    let dates;
    if (typeof value === 'string' && !!value) {
      dates = value
        .split(',')
        .map((str) => str.split(' '))
        .flat()
        .map((str) => str.split('\n'))
        .flat()
        .map((str) => str.trim())
        .filter((a) => !!a)
        .map((date) => {
          const parsedDate = parseUtcDate(date.trim());
          if (typeof parsedDate !== 'string') {
            return parsedDate;
          }
        })
        .filter((date) => !!date);
    } else {
      dates = value;
    }
    setNewValue(dates);
  };

  const getValueFormatted = (): string => {
    try {
      if (newValue) {
        if (newValue instanceof Date) {
          return formatDateUTC(newValue, 'PPP');
        } else if (Array.isArray(newValue) && newValue[0] instanceof Date) {
          return formatDateUTC(newValue[0], 'MM/dd/yyyy...');
        } else if (
          (newValue as DateRange)?.from &&
          (newValue as DateRange)?.to
        ) {
          const range = newValue as DateRange;
          return `${formatDateUTC(range.from!, 'MM/dd/yyyy')} - ${formatDateUTC(range.to!, 'MM/dd/yyyy')}`;
        }
      }

      return '';
    } catch {
      return value as string;
    }
  };

  const getTooltipValue = (): ReactNode => {
    if (value) {
      if (typeof value === 'string') {
        const dates = value.split(',').map((date) => parseUtcDate(date.trim()));
        return (
          <>
            {dates.map((value, index) => (
              <p key={`tooltip-key-${index}`}>{formatDateOrString(value)}</p>
            ))}
          </>
        );
      } else {
        return <p>{getValueFormatted()}</p>;
      }
    } else {
      return <p>No Data</p>;
    }
  };

  const isValidValue = (value: Value): boolean => {
    if (typeof value === 'string') {
      return !!value;
    }
    if (value instanceof Date) {
      return !!value.getTime();
    }
    if (Array.isArray(value)) {
      return !!value.length;
    }
    return !!value;
  };

  const applyValue = () => {
    if (isValidValue(newValue)) {
      onChange?.(newValue);
    } else {
      onParseError?.();
    }
  };

  const onApply = () => {
    applyValue();
    setOpen(false);
  };

  const getCalendarByMode = () => {
    switch (mode) {
      case 'multiple': {
        return (
          <Calendar
            mode="multiple"
            selected={(newValue ? newValue : []) as Date[]}
            onSelect={setNewValue}
          />
        );
      }
      case 'single': {
        return (
          <Calendar
            mode="single"
            selected={newValue as Date}
            onSelect={setNewValue}
          />
        );
      }
      case 'range': {
        return (
          <Calendar
            numberOfMonths={2}
            mode="range"
            selected={newValue as DateRange}
            onSelect={setNewValue}
          />
        );
      }
    }
  };

  const deleteSelectedDate = (date: Date) => {
    setNewValue((prev) => {
      try {
        if (Array.isArray(prev)) {
          return prev.filter((d) => formatDateUTC(d) !== formatDateUTC(date));
        }
        return prev;
      } catch {
        return prev;
      }
    });
  };

  const getSelectedDates = () => {
    const dates = Array.isArray(newValue) ? newValue : [];

    return (
      <Card className="w-64 overflow-x-auto">
        {dates.map((date, index) => (
          <div
            key={`selected-date-${index}`}
            className={cn(
              'px-4 py-2 w-full flex justify-between items-center',
              dates.length > 1 && 'border-b-2',
            )}
          >
            <Label>{format(date, 'MM/dd/yyyy')}</Label>
            <Button
              variant={'ghost'}
              className="h-8 w-8"
              onClick={() => deleteSelectedDate(date)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </Card>
    );
  };

  const onSelectMode = (_: string, mode: string) => {
    setMode(mode as Mode);
    setNewValue(undefined);
  };

  const onCancel = () => {
    parseNewValue();
    setOpen(false);
  };

  const selectOptions: ComboBoxOption[] = useMemo(
    () => [
      {
        value: 'multiple',
        label: 'Date list',
      },
      {
        value: 'range',
        label: 'Date Range',
      },
    ],
    [],
  );

  return (
    <Popover open={open}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild onClick={() => setOpen(true)}>
              <Button
                variant={'outline'}
                className={cn(
                  'justify-start text-left font-normal min-w-56',
                  hasError && 'border-destructive',
                )}
              >
                <CalendarIcon />
                {getValueFormatted()}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{getTooltipValue()}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <ComboBox
              options={selectOptions}
              onSelect={onSelectMode}
              defaultValue={defaultMode}
              autoClose
            />
            {mode === 'range' && (
              <Label className="text-sm font-semibold">
                {getValueFormatted()}
              </Label>
            )}
          </div>
          <div className="flex justify-between gap-3 h-[350px]">
            <Card>{getCalendarByMode()}</Card>
            {mode === 'multiple' && getSelectedDates()}
          </div>
          <div className="flex justify-between">
            <Button variant={'outline'} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant={'default'}
              onClick={onApply}
              disabled={!isValidValue(newValue)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
