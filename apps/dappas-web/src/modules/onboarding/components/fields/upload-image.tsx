'use client';

import UploadButton from '@/core/components/common/upload/upload-button';

type Props = {
  onUpload: (file: File) => void;
  placeholder: string;
};

const UploadImage: React.FC<Props> = ({ onUpload, placeholder }) => {
  const onFileUpload = (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    if (file) {
      onUpload(file);
    }
  };

  return (
    <UploadButton
      multiple={false}
      description="Upload an svg-file or a transparent png of at least 2000x2000 px"
      placeholder={placeholder}
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'],
      }}
      onDrop={onFileUpload}
    />
  );
};

export default UploadImage;
