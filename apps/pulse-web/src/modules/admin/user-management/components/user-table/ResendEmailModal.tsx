'use client';

import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { resendEmail } from '@/server/services/users';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const ResendEmailModal = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();

  const params = useSearchParams();
  const currentModal = params.get('currentModal');
  const userId = params.get('userId');

  const open = useMemo(
    () => currentModal === 'send-email' && !!userId,
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

    const res = await resendEmail(userId as string);
    console.log('res', res);
    if (!res.success) {
      toast.error('Error resending email');
    } else {
      toast.success('Email sent successfully');
      handleCloseModal();
    }
    setLoading(false);
  };

  return (
    <AlertModal
      description="The activation will be resent to this user's email. Are you sure you want to continue?"
      title="Resend activation"
      open={open}
      onClose={handleCloseModal}
      onConfirm={hangleOnDelete}
      loading={loading}
    />
  );
};
