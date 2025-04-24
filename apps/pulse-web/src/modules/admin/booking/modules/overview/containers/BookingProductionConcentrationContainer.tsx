import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getBookingProductionsConcentration } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import BookingProductionConcentration from '../components/BookingProductionConcentration';

type Props = {
  searchParams: SearchParams;
};

const BookingProductionConcentrationContainer = async ({
  searchParams,
}: Props) => {
  const productionConcentration =
    await getBookingProductionsConcentration(searchParams);
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <BookingProductionConcentration
        data={productionConcentration.data ?? []}
        chart={searchParams.chart ?? ''}
      />
    </Suspense>
  );
};

export default BookingProductionConcentrationContainer;
