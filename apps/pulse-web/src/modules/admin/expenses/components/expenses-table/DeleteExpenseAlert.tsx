'use client';

import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { revalidateServerTags } from '@/core/lib/cache';
import { deleteExpense } from '@/server/services/expenses';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const DeleteExpenseAlert = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();

  const searchParams = useSearchParams();
  const currentModal = searchParams.get('currentModal');
  const expenseId = searchParams.get('expenseId');

  const open = useMemo(
    () => currentModal === 'delete-expense' && !!expenseId,
    [currentModal, expenseId],
  );

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: {
        action: 'delete',
        value: '',
      },
      expenseId: {
        action: 'delete',
        value: '',
      },
    });
  };
  const handleDelete = async () => {
    if (expenseId) {
      setLoading(true);

      const result = await deleteExpense(expenseId);
      if (!result.success) {
        toast.error('Error deleting expense');
      } else {
        toast.success('Expense deleted successfully');
        await revalidateServerTags('expenses-list');
        handleCloseModal();
      }
      setLoading(false);
    }
  };

  return (
    <AlertModal
      description="The selected expense will be removed from the system. Are you sure you want to continue?"
      title="Remove expense"
      open={open}
      onClose={handleCloseModal}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
};
