import { getCurrentMonthDateRange } from '@/core/lib/date';
import BookingOverviewContainer from '@/modules/admin/booking/modules/overview/containers/BookingOverviewContainer';
import { SearchParams } from '@/server/types/params';
import { format } from 'date-fns';

type BookingOverviewProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: BookingOverviewProps) {
  const searchParams = await props.searchParams;

  if (!searchParams.from || !searchParams.to) {
    const { from, to } = getCurrentMonthDateRange();
    searchParams.from = format(from, 'yyyy-MM-dd');
    searchParams.to = format(to, 'yyyy-MM-dd');
  }

  searchParams.chart ||= 'booking-values';

  return (
    <div className="p-4">
      <BookingOverviewContainer {...{ searchParams }} />
    </div>
  );
}
