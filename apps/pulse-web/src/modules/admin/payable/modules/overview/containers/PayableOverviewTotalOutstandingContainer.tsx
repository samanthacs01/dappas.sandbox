import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getPayableOverviewChartsData } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableOverviewTotalOutstanding from '../components/PayableOverviewTotalOutstanding';

type Props = {
  searchParams: SearchParams;
};

const PayableOverviewTotalOutstandingContainer = async ({
  searchParams,
}: Props) => {
  const { data } = await getPayableOverviewChartsData(
    searchParams,
    'payables_outstanding_productions',
  );

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableOverviewTotalOutstanding data={data ?? []} />
    </Suspense>
  );
};

export default PayableOverviewTotalOutstandingContainer;
