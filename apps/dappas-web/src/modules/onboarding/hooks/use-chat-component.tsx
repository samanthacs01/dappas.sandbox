import { fileToBase64 } from '@/core/lib/file';
import PackagingSelector from '../components/chat/packaging-selector';
import UploadImage from '../components/fields/upload-image';
import { ComponentCallback } from '../types/chat';

const useChatComponent = () => {
  const getComponent = (
    id: string,
    callback: ComponentCallback,
    key: number
  ) => {
    switch (id) {
      case '<PackageSelector/>':
        return (
          <PackagingSelector
            key={`${id}-${key}`}
            onSelectPackage={(id) => callback({ packageType: id }, 'package type')}
          />
        );
      case '<UploadFile/>':
        return (
          <UploadImage
            key={`${id}-${key}`}
            onUpload={async (file: File) => {
              // convert file to base64
              try {
                const file64 = await fileToBase64(file);
                callback({ logo: file64 }, 'logo');
              } catch (e) {
                console.log(
                  'An error has occurred while converting the file.',
                  e
                );
              }
            }}
            placeholder="Upload your logo"
          />
        );
      default:
        return null;
    }
  };

  return { getComponent };
};

export default useChatComponent;
