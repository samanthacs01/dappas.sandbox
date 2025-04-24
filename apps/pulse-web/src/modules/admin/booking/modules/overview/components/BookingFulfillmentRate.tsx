'use client';
import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';
import { parseToChartType } from '../../../utils/parsers';

type Props = {
  data: ReceivedChart[];
};

const BookingFulfillmentRate: FC<Props> = ({ data }) => {
  const bookingChart: ChartSelectedDisplay = {
    chartType: 'pie',
    data: parseToChartType(data),
    title: 'Booking fulfillment rate',
    config: { legend: false, valueFormat: 'percentage', hiddenBarLabel: true },
  };
  return <ChartSelectionView charts={bookingChart} />;
};

export default BookingFulfillmentRate;
