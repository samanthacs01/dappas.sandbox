import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const PayableOverviewTotalOutstanding: FC<Props> = ({ data }) => {
  const totalOutstanding: ChartSelectedDisplay = {
    chartType: 'bar',
    data: parseToChartType(data),
    title: 'Total payables outstanding',
    subtitle: 'Amount owed/production',
    config: { legend: false, valueFormat: 'currency', hiddenBarLabel: true },
  };
  return <ChartSelectionView charts={totalOutstanding} />;
};

export default PayableOverviewTotalOutstanding;
