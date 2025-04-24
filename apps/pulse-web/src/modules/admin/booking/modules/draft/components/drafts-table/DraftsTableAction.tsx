'use client';
import { Button } from '@/core/components/ui/button';
import { paths } from '@/core/lib/routes';
import { Draft } from '@/server/types/booking';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';

type DraftsTableActionTableActionProps = {
  selectedRows: Draft[];
};

export const DraftsTableActionTableAction: FC<
  DraftsTableActionTableActionProps
> = ({ selectedRows }) => {
  const router = useRouter();
  const enableReview = useMemo(
    () =>
      selectedRows.length &&
      selectedRows.every((row) => row.status === 'pending_to_review'),
    [selectedRows],
  );

  const reviewSelectedDrafts = () => {
    const ids = selectedRows.map((row) => row.id);
    const firstDraft = ids.shift();
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('draftId', id.toString()));
    params.set('totalDrafts', selectedRows.length.toString());
    params.set('reviewedDrafts', '0');
    router.push(
      `${paths.booking.drafts.root}/${firstDraft}?${params.toString()}`,
    );
  };

  return (
    <div className="flex items-center space-x-4 justify-end">
      <Button
        disabled={!enableReview}
        onClick={reviewSelectedDrafts}
        data-cy="review-selected-drafts"
      >
        <Eye />
        Review selected
      </Button>
    </div>
  );
};
