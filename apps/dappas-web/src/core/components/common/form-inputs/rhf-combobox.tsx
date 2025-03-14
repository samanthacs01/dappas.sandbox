import { Label } from '@/core/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { ComboBox } from '../combo-box';
import { ComboBoxOption } from '../combo-box/types';

type ComboBoxProps = {
  name: string;
  label?: string;
  required?: boolean;
  options: ComboBoxOption[];
  placeholder: string;
  disabled?: boolean;
  valueType?: 'text' | 'number';
};


export default function RHFCombobox({
  label,
  name,
  required,
  options,
  placeholder,
  disabled,
  valueType = 'text',
}: Readonly<ComboBoxProps>) {
  const { control, setValue } = useFormContext();

  const handleOnChange = (_id: string, value: string) => {
    const newValue = valueType === 'number' ? +value : value;
    setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
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
                  {label}{' '}
                  {required && (
                    <span className="text-secondary-foreground">*</span>
                  )}
                </>
              ) : (
                label
              )}
            </Label>
          )}

          <ComboBox
            options={options}
            onSelect={handleOnChange}
            placeholder={placeholder}
            defaultValue={field.value?.toString()}
            className="w-full"
            disabled={disabled}
          />
          {error && <p className="text-destructive text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
}
