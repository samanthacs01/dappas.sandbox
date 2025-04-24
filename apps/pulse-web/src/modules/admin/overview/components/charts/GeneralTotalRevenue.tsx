import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const GeneralTotalRevenue: FC<Props> = ({ data }) => {
  const total_overdue: ChartSelectedDisplay = {
    chartType: 'bar',
    data: parseToChartType(data),
    title: 'General total revenue',
    subtitle: 'Value/payer',
    config: {
      valueFormat: 'currency',
      hiddenBarLabel: true,
      unRotateXLabel: true,
    },
  };

  return <ChartSelectionView charts={total_overdue} />;
};

export default GeneralTotalRevenue;
