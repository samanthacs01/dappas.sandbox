'use client';

import { ImageWithFallback } from '@/core/components/commons/image/image-with-fallback';
import { UploadBoxProps } from '@/core/components/commons/upload/types';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import { cn } from '@workspace/ui/lib/utils';
import { Pencil, Upload } from 'lucide-react';
import { FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadLogo: FunctionComponent<UploadBoxProps> = ({
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
    open,
  } = useDropzone({
    disabled,
    accept,
    noClick: true,
    noKeyboard: true,
    ...rest,
  });

  const hasError = isDragReject || error;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className={cn(
          'flex w-full',
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
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <div className="flex gap-2 ">
              <ImageWithFallback
                src={URL.createObjectURL(acceptedFiles[0])}
                alt="Uploaded logo"
                className="w-32 h-auto object-cover rounded aspect-auto"
              />
              <Button
                variant="ghost"
                className="h-8"
                onClick={open}
                tabIndex={0}
                type="button"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className={
                'flex-col justify-center items-center inline-flex h-auto max-w-[425px] gap-3'
              }
            >
              <div
                className={cn(
                  'flex flex-col gap-4 border-2 border-dashed border-zinc-300 cursor-pointer rounded-lg p-4 w-full h-auto',
                  isDragActive && 'bg-secondary',
                  isDragReject && 'border-destructive/40 border-2',
                )}
                onClick={open}
                role="button"
                tabIndex={0}
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
              </div>
              <p className="w-72 text-xs text-center">{description}</p>
            </div>
          )}
        </div>
      </div>

      {hasError && error && (
        <Label className="text-destructive text-xs flex justify-end w-full">{rest.helperText}</Label>
      )}
    </div>
  );
};

export default UploadLogo;
