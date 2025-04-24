import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import {
  getPayableOverviewStackData
} from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableOnTimePaymentRate from '../components/PayableOnTimePaymentRate';

type Props = {
  searchParams: SearchParams;
};

const PayableOnTimePaymentRateContainer = async ({ searchParams }: Props) => {
  const { data } = await getPayableOverviewStackData(
    searchParams,
    'payables_on_time_rate',
  );
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableOnTimePaymentRate data={data ?? []} />
    </Suspense>
  );
};

export default PayableOnTimePaymentRateContainer;
