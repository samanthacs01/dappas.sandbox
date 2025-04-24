'use client';

import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';
import { parseToChartType } from '../../../utils/parsers';

type Props = {
  data: ReceivedChart[];
};

const BookingValuesOverview: FC<Props> = ({ data }) => {
  const bookingChart: ChartSelectedDisplay = {
    chartType: 'bar',
    data: parseToChartType(data),
    title: 'Booking values',
    subtitle: 'Value/Payer',
    config: {
      valueFormat: 'currency',
      hiddenBarLabel: true,
      unRotateXLabel: true,
    },
  };
  return <ChartSelectionView charts={bookingChart} />;
};

export default BookingValuesOverview;
