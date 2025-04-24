import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const CustomerConcentration: FC<Props> = ({ data }) => {
  const total_outstanding: ChartSelectedDisplay = {
    chartType: 'pie',
    data: parseToChartType(data),
    title: 'Customer concentration',
    config: {
      legend: false,
      valueFormat: 'percentage',
    },
  };
  return <ChartSelectionView charts={total_outstanding} />;
};

export default CustomerConcentration;
