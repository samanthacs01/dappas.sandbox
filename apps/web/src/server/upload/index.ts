import { Accept, DropzoneOptions } from 'react-dropzone';

export interface UploadBoxProps extends DropzoneOptions {
  required?: boolean;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  accept?: Accept;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  file?: CustomFile | string | null;
  onDelete?: VoidFunction;
  files?: (File | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
  loading?: boolean;
  simpleUpload?: boolean;
  tableRemoveFile?: (fileName: string) => void;
  labelOrientation?: 'vertical' | 'horizontal';
}

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
  id?: string | number;
}

export type UploadFile = {
  id: number;
  fileName: string;
};
