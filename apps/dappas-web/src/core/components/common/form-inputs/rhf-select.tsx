import { SelectProps } from '@radix-ui/react-select';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type FormSelectProps = SelectProps & {
  name: string;
  options: FormSelectOptions[];
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export type FormSelectOptions = {
  value: string;
  label: string;
};

const RHFSelect: FunctionComponent<FormSelectProps> = ({
  name,
  options,
  label,
  required,
  placeholder,
  ...rest
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
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

          <Select onValueChange={field.onChange} value={field.value} {...rest}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options.length === 0 && (
                <span className="p-2 text-center flex justify-center">
                  No options found.
                </span>
              )}
              {options.map(({ value, label }) => (
                <SelectItem key={`item-${value}`} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <p className="text-destructive text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RHFSelect;
