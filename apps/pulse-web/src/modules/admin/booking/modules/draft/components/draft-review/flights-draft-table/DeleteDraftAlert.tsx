'use client';

import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { revalidateServerTags } from '@/core/lib/cache';
import { paths } from '@/core/lib/routes';
import { deleteDraft } from '@/server/services/booking';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const DeleteDraftAlert = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { updateSearchParams } = useUrlParams();
  const router = useRouter();

  const searchParams = useSearchParams();
  const currentModal = searchParams.get('currentModal');

  const { draftId } = useParams();

  const open = useMemo(() => currentModal === 'delete-draft', [currentModal]);

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: {
        action: 'delete',
        value: '',
      },
    });
  };

  const handleDelete = async () => {
    if (draftId && typeof draftId === 'string') {
      setLoading(true);
      const { error, success } = await deleteDraft(draftId);
      if (success) {
        await revalidateServerTags('drafts');
        toast.success('Draft deleted successfully');
        router.push(paths.booking.drafts.root);
      } else {
        console.log(error);
        toast.error('Error deleting draft');
      }

      setLoading(false);
    }
  };

  return (
    <AlertModal
      description="The selected draft will be eliminated from the system. Are you sure you want to continue?"
      title="Delete draft"
      open={open}
      onClose={handleCloseModal}
      onConfirm={handleDelete}
      loading={loading}
    />
  );
};
