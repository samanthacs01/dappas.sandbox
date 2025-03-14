'use client';

import { Button } from '@/core/components/ui/button';
import { X } from 'lucide-react';
import { FileWithPath } from 'react-dropzone';

type Props = {
  files: FileWithPath[];
  onDelete: (file: FileWithPath) => void;
};

const FileListPreview: React.FC<Props> = ({ files, onDelete }) => {
  return (
    <div className="flex flex-wrap gap-4 w-full justify-center">
      {files.length > 0 && (
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Uploaded Files:</h3>
          <ul className="text-sm h-24 overflow-y-scroll overflow-x-hidden scrollbar-none">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-1"
              >
                <span className="truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(file)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileListPreview;
