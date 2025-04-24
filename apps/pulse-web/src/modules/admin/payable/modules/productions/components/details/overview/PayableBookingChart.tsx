import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const PayableBookingChart: FC<Props> = ({ data }) => {
  const chart: ChartSelectedDisplay = {
    chartType: 'bar',
    data: parseToChartType(data),
    title: 'Booking values',
    subtitle: 'Value/Date',
    config: { valueFormat: 'currency', unRotateXLabel: true },
  };

  return <ChartSelectionView charts={chart} />;
};

export default PayableBookingChart;
