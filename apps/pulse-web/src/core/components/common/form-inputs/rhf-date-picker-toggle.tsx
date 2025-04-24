import { Label } from '@/core/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePickerToggle } from '../date-picker/date-picker-toogle';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  disableErrorLabel?: boolean;
}

const RHFDatePickerToggle = ({
  name,
  label,
  required,
  disableErrorLabel,
  ...others
}: Props) => {
  const { control, setError } = useFormContext();

  const onParseError = () => {
    setError(name, { message: 'error' });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => {
        return (
          <div className="flex flex-col gap-2 w-full">
            {label && (
              <Label htmlFor={name}>
                {label} {required && '*'}
              </Label>
            )}
            <DatePickerToggle
              {...field}
              {...others}
              defaultMode="multiple"
              onParseError={onParseError}
              hasError={invalid}
            />

            {error && !disableErrorLabel && (
              <p className="text-destructive text-sm mt-1">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default RHFDatePickerToggle;
