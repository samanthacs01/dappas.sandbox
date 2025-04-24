import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getProductionsDetailsCharts } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableNetRevenueChart from '../../productions/components/details/overview/PayableNetRevenueChart';

type Props = {
  searchParams: SearchParams;
};

const PayableNetRevenueChartContainer = async ({ searchParams }: Props) => {
  const data = await getProductionsDetailsCharts(
    searchParams,
    'production_details_net_revenues',
  );

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableNetRevenueChart data={data.data ?? []} />
    </Suspense>
  );
};

export default PayableNetRevenueChartContainer;
