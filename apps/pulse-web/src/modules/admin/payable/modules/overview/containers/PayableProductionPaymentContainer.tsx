import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getPayableOverviewChartsData } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableProductionPayment from '../components/PayableProductionPayment';

type Props = {
  searchParams: SearchParams;
};

const PayableProductionPaymentContainer = async ({ searchParams }: Props) => {
  const { data } = await getPayableOverviewChartsData(
    searchParams,
    'paid_uncollected_payment_productions',
  );
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableProductionPayment data={data ?? []} />
    </Suspense>
  );
};

export default PayableProductionPaymentContainer;
