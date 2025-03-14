import { CalendarProps } from '@/core/components/ui/calendar';
import { Label } from '@/core/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '../date-picker';

interface Props extends Omit<CalendarProps, 'selected'> {
  name: string;
  label: string;
  required?: boolean;
}

const RHFDatePicker = ({ name, label, required, ...others }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor={name}>
            {label} {required && '*'}
          </Label>
          <DatePicker {...field} {...others} id={name} autoFocus={false} />
          {error && <p className="text-destructive text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RHFDatePicker;
