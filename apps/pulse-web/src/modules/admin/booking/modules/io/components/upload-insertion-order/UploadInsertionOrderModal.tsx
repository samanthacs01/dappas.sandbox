'use client';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import useUrlParams from '@/core/hooks/use-url-params';
import { Dialog } from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';
import { UploadFileArea } from './UploadFileArea';

const UploadInsertionOrderModal = () => {
  const currentModal = useSearchParams().get('currentModal');
  const { updateSearchParams } = useUrlParams();
  const onClose = () =>
    updateSearchParams({
      currentModal: { action: 'delete', value: 'company-details' },
    });

  return (
    <Dialog open={currentModal === 'upload-order'} data-cy="upload-order-dialog">
      <DialogContent className="[&>button]:hidden max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Upload order files
          </DialogTitle>
        </DialogHeader>
        <UploadFileArea onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadInsertionOrderModal;
