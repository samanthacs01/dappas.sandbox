import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getBookingPayerConcentration } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import BookingCustomerConcentration from '../components/BookingCustomerConcentration';


type Props = {
  searchParams: SearchParams;
};

const BookingCustomerConcentrationContainer = async ({
  searchParams,
}: Props) => {
  const customerConcentration =
    await getBookingPayerConcentration(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <BookingCustomerConcentration
        data={customerConcentration.data ?? []}
        chart={searchParams.chart ?? ''}
      />
    </Suspense>
  );
};

export default BookingCustomerConcentrationContainer;
