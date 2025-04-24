'use client';

import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { revalidateServerTags } from '@/core/lib/cache';
import { deletePayableProduction } from '@/server/services/payable';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const DeleteProductionAlert = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();

  const searchParams = useSearchParams();
  const currentModal = searchParams.get('currentModal');
  const productionId = searchParams.get('productionId');

  const open = useMemo(
    () => currentModal === 'delete-production' && !!productionId,
    [currentModal, productionId],
  );

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: {
        action: 'delete',
        value: '',
      },
      productionId: {
        action: 'delete',
        value: '',
      },
    });
  };

  const handleOnDeleteProduction = async () => {
    if (productionId) {
      setLoading(true);
      const res = await deletePayableProduction(+productionId);
      if (!res.success) {
        toast.error('Error deleting production');
      } else {
        await revalidateServerTags('payable-productions');
        toast.success('Production deleted successfully');
      }
      setLoading(false);
    }
  };

  return (
    <AlertModal
      description="The selected company will be removed from the system. Are you sure you want to continue?"
      title="Remove Production"
      open={open}
      onClose={handleCloseModal}
      onConfirm={handleOnDeleteProduction}
      loading={loading}
    />
  );
};
