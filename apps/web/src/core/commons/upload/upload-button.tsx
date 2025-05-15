import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import { FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { UploadBoxProps } from '@/server/upload';

const UploadButton: FunctionComponent<UploadBoxProps> = ({
  label,
  required,
  disabled,
  accept,
  error,
  description,
  labelOrientation = 'vertical',

  ...rest
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    disabled,
    accept,
    ...rest,
  });

  const hasError = isDragReject || error;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className={cn(
          'flex',
          labelOrientation === 'vertical'
            ? 'flex-col gap-2'
            : 'flex-row gap-10 items-start',
        )}
      >
        {label ? (
          typeof label === 'string' ? (
            <Label
              htmlFor={'upload-button'}
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

        <div
          className={
            'flex-col justify-center items-center inline-flex h-auto max-w-[425px] gap-3'
          }
        >
          <div
            className={cn(
              'flex flex-col gap-4 border-2 border-dashed border-zinc-300 cursor-pointer px-20 md:px-32 py-7',
              isDragActive && 'bg-secondary',
              isDragReject && 'border-destructive/40 border-2',
            )}
            {...getRootProps()}
          >
            <div
              className={
                'flex flex-col items-center gap-3 w-full justify-start'
              }
            >
              <Upload />
              <Label className="flex text-base text-center font-normal cursor-pointer">
                <span className="text-zinc-400">
                  Drop your logo here or{' '}
                  <strong className="text-black">Choose File</strong>
                </span>
              </Label>
            </div>
            <input {...getInputProps()} />
          </div>
          <p className="w-72 text-xs text-center">{description}</p>
        </div>
      </div>
      {acceptedFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {acceptedFiles.map((file) => (
            <div key={file.name} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {file.size} bytes
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && error && (
        <Label className="text-destructive text-xs">{rest.helperText}</Label>
      )}
    </div>
  );
};

export default UploadButton;
