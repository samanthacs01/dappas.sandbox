import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import UploadButtonTable from '../upload/components/upload-button-table';
import { UploadBoxProps, UploadFile } from '../upload/types';
import UploadButton from '../upload/upload-button';
type UploadProps = UploadBoxProps & {
  name: string;
};

const RHFUploadButton: FunctionComponent<UploadProps> = ({
  label,
  name,
  accept,
  required,
  ...rest
}) => {
  const { control, setValue, watch } = useFormContext();
  const filesValue = watch(name);
  const files =
    filesValue && (Array.isArray(filesValue) ? filesValue : [filesValue]);

  const handleFileRemove = (file: string) => {
    const newFiles = files.filter((f: File) => f?.name !== file);
    setValue(name, newFiles, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-6">
          <UploadButton
            {...field}
            label={label}
            required={required}
            accept={accept}
            error={!!error}
            helperText={error?.message}
            {...rest}
          />
          {files?.length > 0 && (
            <div className="mt-2">
              <UploadButtonTable
                data={files.map(
                  (file: File, id: number) =>
                    ({
                      fileName: file?.name,
                      id,
                    }) as UploadFile,
                )}
                onRemove={handleFileRemove}
              />
            </div>
          )}
        </div>
      )}
    />
  );
};

export default RHFUploadButton;
