import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getBookingFulfillmentRate } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import BookingFulfillmentRate from '../components/BookingFulfillmentRate';

type Props = {
  searchParams: SearchParams;
};

const BookingFulfillmentRateContainer = async ({ searchParams }: Props) => {
  const fulfillmentRate = await getBookingFulfillmentRate(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <BookingFulfillmentRate data={fulfillmentRate.data ?? []} />
    </Suspense>
  );
};

export default BookingFulfillmentRateContainer;
