import { SelectProps } from '@radix-ui/react-select';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@workspace/ui/lib/utils';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type FormSelectProps = SelectProps & {
  name: string;
  options: FormSelectOptions[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  labelOrientation?: 'horizontal' | 'vertical';
  className?: string;
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
  labelOrientation = 'vertical',
  className,
  ...rest
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col">
          <div
            className={cn(
              'flex',
              labelOrientation === 'vertical'
                ? 'flex-col gap-2'
                : 'flex-row gap-10',
            )}
          >
            {label && (
              <Label
                htmlFor={name}
                className={cn(
                  error && 'text-destructive',
                  'font-medium',
                  labelOrientation === 'vertical' ? '' : 'w-1/3',
                )}
              >
                {typeof label === 'string' ? (
                  <>
                    {label}{' '}
                    {required && <span className="text-gray-900">*</span>}
                  </>
                ) : (
                  label
                )}
              </Label>
            )}

            <Select
              onValueChange={field.onChange}
              value={field.value}
              {...rest}
            >
              <SelectTrigger className={cn('w-full', className)}>
                <SelectValue placeholder={placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent className="h-[200px] overflow-y-auto">
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
          </div>
          {error && (
            <Label className="text-destructive text-xs mt-1 w-full flex justify-end">
              {error.message}
            </Label>
          )}
        </div>
      )}
    />
  );
};

export default RHFSelect;
