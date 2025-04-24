import { Accept } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';
import { UploadBoxProps } from '../upload/types';
import UploadBox from '../upload/upload-box';

type Props = Omit<UploadBoxProps, 'files'> & {
  name: string;
  placeholder?: string;
  accept?: Accept;
  label: string;
};

const RHFUploadBox = ({
  name,
  placeholder,
  accept,
  label,
  ...others
}: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-2 w-full">
          <UploadBox
            {...field}
            error={!!error}
            file={field.value}
            helperText={error?.message}
            placeholder={placeholder}
            accept={accept}
            label={label}
            {...others}
          />
          {!!error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RHFUploadBox;
