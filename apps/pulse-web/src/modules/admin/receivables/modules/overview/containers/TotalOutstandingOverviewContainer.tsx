import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getReceivablesTotalOutstanding } from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import TotalOutstandingOverview from '../components/TotalOutstandingOverview';

type Props = {
  searchParams: SearchParams;
};

const TotalOutstandingOverviewContainer = async ({ searchParams }: Props) => {
  const total_outstanding = await getReceivablesTotalOutstanding(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <TotalOutstandingOverview data={total_outstanding.data ?? []} />
    </Suspense>
  );
};

export default TotalOutstandingOverviewContainer;
