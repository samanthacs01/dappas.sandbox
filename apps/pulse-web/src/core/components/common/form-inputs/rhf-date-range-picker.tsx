import { Label } from '@/core/components/ui/label';
import { SelectRangeEventHandler } from 'react-day-picker';
import { Controller, useFormContext } from 'react-hook-form';
import { DateRangePicker } from '../date-picker';
import { DateRangePickerProps } from '../date-picker/date-range-picker';

interface Props extends DateRangePickerProps {
  name: string;
  label?: string;
}

const RHFDateRangePicker = ({ name, label, ...others }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onChangeRange: SelectRangeEventHandler = (range) => {
          const newRange = [range?.from, range?.to];
          field.onChange(newRange);
        };
        return (
          <div className="flex flex-col gap-2 w-full">
            {label && <Label htmlFor={name}>{label}</Label>}
            <DateRangePicker
              {...field}
              {...others}
              id={name}
              dateRange={{ from: field.value[0], to: field.value[1] }}
              onSelectRange={onChangeRange}
            />
            {error && (
              <p className="text-destructive text-sm mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default RHFDateRangePicker;
