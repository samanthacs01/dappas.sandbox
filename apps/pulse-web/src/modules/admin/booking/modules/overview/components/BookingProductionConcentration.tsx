'use client';
import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';
import { parseToChartType } from '../../../utils/parsers';

type Props = {
  data: ReceivedChart[];
  chart: string;
};

const BookingProductionConcentration: FC<Props> = ({ data, chart }) => {
  const bookingChart: ChartSelectedDisplay = {
    chartType: 'pie',
    data: parseToChartType(data),
    title: 'Production concentration',
    config: { legend: false, valueFormat: 'percentage' },
  };
  return <ChartSelectionView charts={bookingChart} />;
};

export default BookingProductionConcentration;
