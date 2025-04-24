import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { SearchParams } from '@/server/types/params';
import { PayableProductionDto } from '@/server/types/payable';
import { FC, Suspense, useCallback } from 'react';
import { ProductionHeader } from '../../productions/components/details/ProductionHeader';
import PayableNetRevenueChartContainer from './PayableNetRevenueChartContainer';
import PayableProductionsOverviewStatsContainer from './PayableProductionsOverviewStatsContainer';
import ProductionBookingOverviewContainer from './ProductionBookingOverviewContainer';

type ProductionOverviewDetailsContainerProps = {
  production: PayableProductionDto;
  searchParams: SearchParams;
};

export const ProductionOverviewDetailsContainer: FC<
  ProductionOverviewDetailsContainerProps
> = ({ production, searchParams }) => {
  const renderChart = useCallback(
    (chart: string) => {
      switch (chart) {
        case 'net-revenue':
          return <PayableNetRevenueChartContainer {...{ searchParams }} />;

        default:
          return <ProductionBookingOverviewContainer {...{ searchParams }} />;
      }
    },
    [searchParams],
  );
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductionHeader name={production.entity_name} />

      <Suspense
        fallback={<CustomSkeleton width={300} height={200} count={4} />}
      >
        <PayableProductionsOverviewStatsContainer searchParams={searchParams} />
      </Suspense>
      {renderChart(searchParams.production_chart as string)}
    </div>
  );
};
