import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { Upload } from 'lucide-react';

export const InsertionOrderUploadButton = () => {
  const { updateSearchParams } = useUrlParams();

  const openUploadModal = () => {
    updateSearchParams({
      currentModal: {
        action: 'set',
        value: 'upload-order',
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={openUploadModal} data-cy="upload-order">
        <Upload className="mr-2 h-4 w-4" />
        Upload order
      </Button>
    </div>
  );
};
