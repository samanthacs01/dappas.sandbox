import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import React, { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type TextFieldProps = React.ComponentProps<'input'> & {
  name: string;
  label?: string | ReactNode;
  required?: boolean;
  disableErrorLabel?: boolean;
  labelOrientation?: 'horizontal' | 'vertical';
};

const RHFTextField = ({
  label,
  name,
  required,
  type = 'text',
  disableErrorLabel,
  labelOrientation = 'vertical',
  ...others
}: TextFieldProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            'flex',
            labelOrientation === 'vertical'
              ? 'flex-col gap-2'
              : 'flex-row gap-10',
          )}
        >
          {label ? (
            typeof label === 'string' ? (
              <Label
                htmlFor={name}
                className={cn(
                  error && 'text-destructive',
                  'font-medium',
                  labelOrientation === 'vertical' ? '' : 'w-1/3',
                )}
              >
                {label} {required && '*'}
              </Label>
            ) : (
              label
            )
          ) : null}
          <Input
            {...field}
            onChange={(event) => {
              if (type === 'number') {
                field.onChange(Number(event.target.value));
              } else {
                field.onChange(event.target.value);
              }
            }}
            className={`${error && 'border-destructive focus-visible:ring-destructive focus-visible:outline-none'}`}
            type={type}
            {...others}
          />
          {error && !disableErrorLabel && (
            <Label className="text-destructive text-xs mt-1">
              {error.message}
            </Label>
          )}
        </div>
      )}
      rules={{ required }}
      name={name}
      control={control}
    />
  );
};

export default RHFTextField;
