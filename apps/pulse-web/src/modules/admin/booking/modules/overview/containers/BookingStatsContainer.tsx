import { getBookingStats } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import BookingStatsOverview from '../components/BookingStatsOverview';

const BookingStatsContainer = async ({
  initialSearchParams,
  direction,
}: {
  initialSearchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
}) => {
  const stats = await getBookingStats(initialSearchParams);
  if (!stats.data) {
    return (
      <div className="text-center">
        Sorry, an error occurred. Please try again later.
      </div>
    );
  }
  return <BookingStatsOverview stats={stats.data} direction={direction} />;
};

export default BookingStatsContainer;
