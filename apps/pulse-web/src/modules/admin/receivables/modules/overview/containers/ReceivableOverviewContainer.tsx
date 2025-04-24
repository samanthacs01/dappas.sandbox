import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import { SearchParams } from '@/server/types/params';
import { Suspense, useCallback } from 'react';
import CollectionRateContainer from './CollectionRateContainer';
import CustomerConcentrationContainer from './CustomerConcentrationContainer';
import ReceivableOverviewStatsContainer from './ReceivableOverviewStatsContainer';
import TotalOutstandingOverviewContainer from './TotalOutstandingOverviewContainer';
import TotalOverdueInvoicesContainer from './TotalOverdueInvoicesContainer';

type Props = {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
};

const ReceivableOverviewContainer = ({ searchParams, direction }: Props) => {
  const renderChart = useCallback(
    (chart: string) => {
      switch (chart) {
        case 'overdue-invoices':
          return <TotalOverdueInvoicesContainer {...{ searchParams }} />;
        case 'collection-rate':
          return <CollectionRateContainer {...{ searchParams }} />;
        case 'customer-concentration':
          return <CustomerConcentrationContainer {...{ searchParams }} />;
        case 'total_outstanding':
        default:
          return <TotalOutstandingOverviewContainer {...{ searchParams }} />;
      }
    },
    [searchParams.receivable_chart],
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
        <ReceivableOverviewStatsContainer {...{ searchParams, direction }} />
      </Suspense>
      {renderChart(searchParams.receivable_chart as string)}
    </div>
  );
};

export default ReceivableOverviewContainer;
