'use client';
import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';
import CollectionRateCharts from './CollectionRateCharts';

type Props = {
  withPayment: ReceivedChart[];
  overallRate: ReceivedChart[];
};

const CollectionRateOverview: FC<Props> = ({ overallRate, withPayment }) => {
  const collectionRate: ChartSelectedDisplay = {
    chartType: 'multiple',
    title: 'Total receivables outstanding',
    subtitle: 'Amount owed/payer',
    withoutExpandHeader: true,
    config: {
      children: (
        <CollectionRateCharts
          withPayment={parseToChartType(withPayment)}
          overallRate={parseToChartType(overallRate)}
        />
      ),
      valueFormat: 'percentage',
    },
  };
  return <ChartSelectionView charts={collectionRate} />;
};

export default CollectionRateOverview;
