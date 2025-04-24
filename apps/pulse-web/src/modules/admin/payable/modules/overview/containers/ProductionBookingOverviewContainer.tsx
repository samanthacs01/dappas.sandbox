import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getProductionsDetailsCharts } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableBookingChart from '../../productions/components/details/overview/PayableBookingChart';

type Props = {
  searchParams: SearchParams;
};

const ProductionBookingOverviewContainer = async ({ searchParams }: Props) => {
  const data = await getProductionsDetailsCharts(
    searchParams,
    'production_details_bookings',
  );
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableBookingChart data={data.data ?? []} />
    </Suspense>
  );
};

export default ProductionBookingOverviewContainer;
