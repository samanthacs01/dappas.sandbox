import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';

type Props = {
  data: ReceivedChart[];
};

const PayableNetRevenueChart = ({ data }: Props) => {
  const chart: ChartSelectedDisplay = {
    chartType: 'bar',
    data: parseToChartType(data),
    title: 'Net revenue',
    subtitle: 'Value/Date',
    config: { valueFormat: 'currency' },
  };
  return <ChartSelectionView charts={chart} />;
};

export default PayableNetRevenueChart;
