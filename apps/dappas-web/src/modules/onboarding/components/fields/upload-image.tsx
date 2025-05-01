'use client';

import UploadButton from '@/core/components/common/upload/upload-button';

type Props = {
  onUpload: (file: File) => void;
  placeholder: string;
};

const UploadImage: React.FC<Props> = ({ onUpload, placeholder }) => {
  const onFileUpload = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  };

  return (
    <UploadButton
      multiple={false}
      placeholder={placeholder}
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'],
      }}
      onDrop={onFileUpload}
    />
  );
};

export default UploadImage;
