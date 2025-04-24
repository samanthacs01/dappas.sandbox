import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getTotalRevenue } from '@/server/services/overview';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import GeneralTotalRevenue from '../components/charts/GeneralTotalRevenue';

type Props = {
  searchParams: SearchParams;
};

const GeneralTotalRevenueContainer = async ({ searchParams }: Props) => {
  const totalRevenue = await getTotalRevenue(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <GeneralTotalRevenue data={totalRevenue.data ?? []} />
    </Suspense>
  );
};

export default GeneralTotalRevenueContainer;
