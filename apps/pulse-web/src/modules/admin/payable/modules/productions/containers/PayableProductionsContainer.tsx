import Loader from '@/core/components/common/loading/app-loading';
import { getPayableProduction } from '@/server/services/payable';
import { Suspense } from 'react';
import ProductionFormContainer from '../components/form/ProductionFormContainer';

type PayableProductionsContainerProps = {
  id?: string;
};

async function PayableProductionsContainer({
  id,
}: PayableProductionsContainerProps) {
  let result = null;
  if (id) {
    result = await getPayableProduction(id);
  }

  const isEditing = !!id;

  return (
    <Suspense fallback={<Loader />}>
      <ProductionFormContainer
        isEditing={isEditing}
        production={result?.data ?? undefined}
      />
    </Suspense>
  );
}

export default PayableProductionsContainer;
