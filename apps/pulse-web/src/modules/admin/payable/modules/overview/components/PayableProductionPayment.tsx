import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';
type Props = {
  data: ReceivedChart[];
};

const PayableProductionPayment: FC<Props> = ({ data }) => {
  const productionPayment: ChartSelectedDisplay = {
    title: 'Production payment on uncollected invoices',
    subtitle: 'Amount paid/production',
    chartType: 'bar',
    config: {
      legend: false,
      valueFormat: 'currency',
    },
    data: parseToChartType(data),
  };
  return <ChartSelectionView charts={productionPayment} />;
};

export default PayableProductionPayment;
