import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getReceivableCustomerConcentration } from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import CustomerConcentration from '../components/CustomerConcentration';

type Props = {
  searchParams: SearchParams;
};

const CustomerConcentrationContainer = async ({ searchParams }: Props) => {
  const customerConcentration = await getReceivableCustomerConcentration(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <CustomerConcentration data={customerConcentration.data ?? []} />
    </Suspense>
  );
};

export default CustomerConcentrationContainer;
