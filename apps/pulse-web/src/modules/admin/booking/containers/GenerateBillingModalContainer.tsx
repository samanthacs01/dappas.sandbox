import useUrlParams from '@/core/hooks/use-url-params';
import { Invoice } from '@/server/types/booking';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import GenerateBillingModal from '../modules/flights/components/flights-table/generate-billing-table/GenerateBillingModal';

type TableGenerateBillingModalContainerProps = {
  data: Invoice[];
  clearSelection: VoidFunction;
};

export const TableGenerateBillingModalContainer: FC<
  TableGenerateBillingModalContainerProps
> = ({ data, clearSelection }) => {
  const currentModal = useSearchParams().get('currentModal');
  const { updateSearchParams } = useUrlParams();
  const onClose = () =>
    updateSearchParams({
      currentModal: { action: 'delete', value: 'generate-billing' },
    });

  return (
    <GenerateBillingModal
      onClose={onClose}
      open={currentModal === 'generate-billing' && !!data}
      data={data}
      clearSelection={clearSelection}
    />
  );
};
