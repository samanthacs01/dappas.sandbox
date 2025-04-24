import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { revalidateServerTags } from '@/core/lib/cache';
import { deleteReceivablePayer } from '@/server/services/receivables';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const DeletePayerAlert = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();

  const params = useSearchParams();
  const currentModal = params.get('currentModal');
  const payerId = params.get('payerId');

  const open = useMemo(
    () => currentModal === 'delete-payer' && !!payerId,
    [currentModal, payerId],
  );

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: { action: 'delete', value: '' },
      payerId: { action: 'delete', value: '' },
    });
  };

  const handleOnDeletePayer = async () => {
    setLoading(true);

    const res = await deleteReceivablePayer(payerId as string);
    if (!res.success) {
      toast.error('Error deleting receivable payer');
    } else {
      toast.success('Receivable payer deleting successfully');
      await revalidateServerTags('receivables-payers');
      handleCloseModal();
    }
    setLoading(false);
  };

  return (
    <AlertModal
      description="The selected payer will be removed from the system. Are you sure you want to continue?"
      title="Remove payer"
      open={open}
      onClose={handleCloseModal}
      onConfirm={handleOnDeletePayer}
      loading={loading}
    />
  );
};
