import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import { SearchParams } from '@/server/types/params';
import { Suspense, useCallback } from 'react';
import BookingCustomerConcentrationContainer from './BookingCustomerConcentrationContainer';
import BookingFulfillmentRateContainer from './BookingFulfillmentRateContainer';
import BookingProductionConcentrationContainer from './BookingProductionConcentrationContainer';
import BookingStatsContainer from './BookingStatsContainer';
import BookingValuesOverviewContainer from './BookingValuesOverviewContainer';

const BookingOverviewContainer = async ({
  searchParams,
  direction = 'vertical',
}: {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
}) => {
  const renderChart = useCallback(
    (chart: string) => {
      switch (chart) {
        case 'fulfillment-rate':
          return <BookingFulfillmentRateContainer {...{ searchParams }} />;
        case 'customer-concentration':
          return (
            <BookingCustomerConcentrationContainer {...{ searchParams }} />
          );
        case 'production-concentration':
          return (
            <BookingProductionConcentrationContainer {...{ searchParams }} />
          );
        case 'booking-values':
        default:
          return <BookingValuesOverviewContainer {...{ searchParams }} />;
      }
    },
    [searchParams.booking_chart],
  );

  return (
    <div
      className={`${direction === 'horizontal' ? 'grid grid-cols-2 gap-4' : 'space-y-4 '}`}
    >
      {direction !== 'horizontal' && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Overview</h3>
          <DateRangeFilter />
        </div>
      )}

      <Suspense
        fallback={
          <CustomSkeleton
            width={300}
            height={200}
            count={4}
            className={
              direction === 'horizontal' ? 'grid grid-cols-2 gap-4' : ''
            }
          />
        }
      >
        <BookingStatsContainer
          {...{ initialSearchParams: searchParams, direction }}
        />
      </Suspense>
      {renderChart(searchParams.booking_chart as string)}
    </div>
  );
};

export default BookingOverviewContainer;
