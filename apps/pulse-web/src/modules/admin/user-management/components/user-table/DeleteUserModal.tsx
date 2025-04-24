import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { revalidateServerTags } from '@/core/lib/cache';
import { deleteUser } from '@/server/services/users';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const DeleteUserModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();

  const params = useSearchParams();
  const currentModal = params.get('currentModal');
  const userId = params.get('userId');

  const open = useMemo(
    () => currentModal === 'delete-user' && !!userId,
    [currentModal, userId],
  );

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: { action: 'delete', value: '' },
      userId: { action: 'delete', value: '' },
    });
  };

  const hangleOnDelete = async () => {
    setLoading(true);

    const res = await deleteUser(userId as string);
    if (!res.success) {
      toast.error('Error deleting user');
    } else {
      toast.success('User deleted successfully');
      await revalidateServerTags('users');
      handleCloseModal();
    }
    setLoading(false);
  };

  return (
    <AlertModal
      description="The selected user will be removed from the system. Are you sure you want to continue?"
      title="Remove user"
      open={open}
      onClose={handleCloseModal}
      onConfirm={hangleOnDelete}
      loading={loading}
    />
  );
};
