import { CircularLoading } from '@/core/components/common/loading/circular-loading';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { paths } from '@/core/lib/routes';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type DraftReviewActionsProps = {
  loading: boolean;
};

export const DraftReviewActions: FC<DraftReviewActionsProps> = ({
  loading,
}) => {
  const router = useRouter();
  const { updateSearchParams } = useUrlParams();
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);

  const onBack = () => {
    router.push(paths.booking.drafts.root);
  };

  const onDelete = () => {
    updateSearchParams({
      currentModal: {
        action: 'set',
        value: 'delete-draft',
      },
    });
  };

  return (
    <div className="w-full flex justify-end gap-2.5">
      <Button
        variant={'destructive'}
        type="button"
        onClick={onDelete}
        disabled={loading}
        data-cy="delete-draft"
      >
        <Trash2 />
        Delete draft
      </Button>
      <Button
        variant={'secondary'}
        type="button"
        onClick={onBack}
        disabled={loading}
        data-cy="back-to-drafts"
      >
        Cancel
      </Button>
      <Button
        variant={'default'}
        type="submit"
        disabled={loading || !isValidForm}
        data-cy="create-insertion-order"
      >
        Create order
        <CircularLoading loading={loading} />
      </Button>
    </div>
  );
};
