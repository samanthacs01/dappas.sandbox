import { UploadBoxProps } from '@/core/components/commons/upload/types';
import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import UploadLogo from './upload-logo';

type UploadProps = UploadBoxProps & {
  name: string;
};

const RHFUploadLogo: FunctionComponent<UploadProps> = ({
  label,
  name,
  required,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-6">
          <UploadLogo
            {...field}
            label={label}
            required={required}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] }}
            error={!!error}
            helperText={error?.message}
            onDrop={(acceptedFiles) => {
              field.onChange(acceptedFiles[0]);
            }}
            description="Upload an svg-file or a transparent png of at least 2000x2000 px"
            {...rest}
          />
        </div>
      )}
    />
  );
};

export default RHFUploadLogo;
