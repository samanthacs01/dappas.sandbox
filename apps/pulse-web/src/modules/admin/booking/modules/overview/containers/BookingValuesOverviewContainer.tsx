import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getBookingValues } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import BookingValuesOverview from '../components/BookingValuesOverview';

type Props = {
  searchParams: SearchParams;
};

const BookingValuesOverviewContainer = async ({ searchParams }: Props) => {
  const bookingValues = await getBookingValues(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <BookingValuesOverview data={bookingValues.data ?? []} />
    </Suspense>
  );
};

export default BookingValuesOverviewContainer;
