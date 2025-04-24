import { Label } from '@/core/components/ui/label';
import { cn } from '@/core/lib/utils';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { UploadBoxProps } from './types';

const UploadBox = ({
  placeholder,
  error,
  disabled,
  className,
  accept,
  label,
  ...others
}: UploadBoxProps) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({ disabled, accept, ...others });

  const hasError = isDragReject || error;

  return (
    <div
      {...getRootProps()}
      className={cn(
        ` h-20 w-full border-2 border-solid hover:cursor-pointer hover:opacity-60 ${hasError ? 'border-red-500 text-red-500 bg-red-500/10' : ''} ${isDragActive ? 'opacity-50' : ''} rounded-lg relative flex items-center justify-center p-6 ${className}`,
      )}
      id="file-upload"
    >
      <Label
        htmlFor="file-upload"
        className="absolute -top-3 left-4 p-1 bg-white"
      >
        {label}
      </Label>
      <div
        className={cn(
          `flex flex-col items-center justify-center gap-2 border border-dashed w-full h-auto min-h-12 rounded-lg ${hasError ? 'text-red-500' : ''}`,
        )}
      >
        <input {...getInputProps()} />
        {placeholder || <Upload />}
      </div>
    </div>
  );
};

export default UploadBox;
