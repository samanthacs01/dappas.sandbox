import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import { SearchParams } from '@/server/types/params';
import { Suspense, useCallback } from 'react';
import PayableOnTimePaymentRateContainer from './PayableOnTimePaymentRateContainer';
import PayableOverviewStatsContainer from './PayableOverviewStatsContainer';
import PayableOverviewTotalOutstandingContainer from './PayableOverviewTotalOutstandingContainer';
import PayableProductionPaymentContainer from './PayableProductionPaymentContainer';
import PayableTotalOverdueBillsContainer from './PayableTotalOverdueBillsContainer';

type Props = {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
};

const PayableOverviewContainer = ({ searchParams, direction }: Props) => {
  const renderChart = useCallback(
    (chart: string) => {
      switch (chart) {
        case 'total-overdue-bills':
          return <PayableTotalOverdueBillsContainer {...{ searchParams }} />;
        case 'on-time-payment-rate':
          return <PayableOnTimePaymentRateContainer {...{ searchParams }} />;
        case 'production-payment':
          return <PayableProductionPaymentContainer {...{ searchParams }} />;
        case 'total-payables-outstanding':
        default:
          return (
            <PayableOverviewTotalOutstandingContainer {...{ searchParams }} />
          );
      }
    },
    [searchParams.payable_chart],
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
        <PayableOverviewStatsContainer {...{ searchParams, direction }} />
      </Suspense>
      {renderChart(searchParams.payable_chart as string)}
    </div>
  );
};

export default PayableOverviewContainer;
