import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';
import { ComboBoxOption } from '@/server/types/combo-box';
import { Controller, useFormContext } from 'react-hook-form';
import { FormComboBox } from '../combo-box';

export type RHFFromComboboxProps = {
  name: string;
  label?: string;
  required?: boolean;
  options: ComboBoxOption[];
  placeholder: string;
  disabled?: boolean;
  disableErrorLabel?: boolean;
  triggerClassName?: string;
  autoClose?: boolean;
};

export default function RHFFromCombobox({
  label,
  name,
  required,
  options,
  placeholder,
  disabled,
  disableErrorLabel,
  triggerClassName,
  autoClose,
}: Readonly<RHFFromComboboxProps>) {
  const { control, setValue } = useFormContext();

  const handleOnChange = (_id: string, value: string) => {
    setValue(name, Number(value), { shouldValidate: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2">
          {label && (
            <Label htmlFor={name}>
              {typeof label === 'string' ? (
                <>
                  {label} {required && <span className="text-gray-900">*</span>}
                </>
              ) : (
                label
              )}
            </Label>
          )}

          <FormComboBox
            options={options}
            onSelect={handleOnChange}
            placeholder={placeholder}
            defaultValue={field.value?.toString()}
            className={'w-full transition-colors'}
            disabled={disabled}
            triggerClassName={cn(
              triggerClassName,
              error && 'border-destructive',
            )}
            autoClose={autoClose}
          />
          {error && !disableErrorLabel && (
            <p className="text-destructive text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
