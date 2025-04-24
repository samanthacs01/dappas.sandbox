import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import useUrlParams from '@/core/hooks/use-url-params';
import { DraftDetails, DraftFlights } from '@/server/types/booking';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

export const DeletePayerAlert = () => {
  const { updateSearchParams } = useUrlParams();
  const { setValue, getValues } = useFormContext<DraftDetails>();

  const params = useSearchParams();
  const currentModal = params.get('currentModal');
  const deleteIndex = params.get('deleteIndex');

  const open = useMemo(
    () => currentModal === 'delete-flight-draft' && !!deleteIndex,
    [currentModal],
  );

  const handleCloseModal = () => {
    updateSearchParams({
      currentModal: { action: 'delete', value: '' },
      deleteIndex: { action: 'delete', value: '' },
    });
  };

  const handleDelete = async () => {
    const flights: DraftFlights[] = getValues('flights');
    const filteredFlights = flights.filter(
      (_, index) => deleteIndex !== index.toString(),
    );
    setValue('flights', filteredFlights);
  };

  return (
    <AlertModal
      description="The selected row(s) will be eliminated from the flights draft. Are you sure you want to continue?"
      title="Delete row(s)"
      open={open}
      onClose={handleCloseModal}
      onConfirm={handleDelete}
    />
  );
};
