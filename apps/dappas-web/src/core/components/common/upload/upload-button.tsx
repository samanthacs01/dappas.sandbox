'use client';

import { Button } from '@/core/components/ui/button';
import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';
import { FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadBoxProps } from './types';

const UploadButton: FunctionComponent<UploadBoxProps> = ({
  label,
  required,
  disabled,
  accept,
  error,
  ...rest
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      disabled,
      accept,
      ...rest,
    });

  const hasError = isDragReject || error;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="upload-button">
        {required ? <span>{label} *</span> : label}
      </Label>
      <div
        className={
          'bg-primary-foreground rounded-lg flex-col justify-center items-center inline-flex h-auto p-2'
        }
        {...getRootProps()}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-4 border border-dashed w-full rounded-lg h-full cursor-pointer p-2',
            isDragActive && 'bg-secondary',
            isDragReject && 'border-destructive/40 border-2',
          )}
        >
          <div
            className={'flex items-center gap-4 w-full flex-row justify-start'}
          >
            <Button type="button">Choose files to upload</Button>
            <Label className="text-sm font-medium cursor-pointer hover:underline">
              or drag and drop them here
            </Label>
          </div>
          <input {...getInputProps()} />
        </div>
      </div>

      {hasError && error && (
        <Label className="text-destructive text-xs">{rest.helperText}</Label>
      )}
    </div>
  );
};

export default UploadButton;
