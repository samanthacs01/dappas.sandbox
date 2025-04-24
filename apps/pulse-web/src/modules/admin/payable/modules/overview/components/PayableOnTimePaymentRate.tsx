import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToDataKey } from '@/modules/admin/overview/utils/chart';
import {
  ChartSelectedDisplay,
  ReceivedOverdueChart,
} from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import { FC } from 'react';

type Props = {
  data: ReceivedOverdueChart[];
};

const PayableOnTimePaymentRate: FC<Props> = ({ data }) => {
  const onTimePayment: DataSeries[] = data.map((item) => {
    const updatedItem: DataSeries = { name: item.name };

    Object.keys(item).forEach((key) => {
      if (key === 'name') {
        updatedItem[key] = item[key];
      } else {
        updatedItem[parseToDataKey(key)] = item[key] ?? 0;
      }
    });

    return updatedItem;
  });
  const bars: string[] = data
    ? Object.keys(data[0])
        .filter((key) => key !== 'name' && key !== undefined)
        .reverse()
    : [];

  const onTimePaymentRate: ChartSelectedDisplay = {
    chartType: 'stackedBar',
    data: onTimePayment,

    config: {
      legend: true,
      legendValues: [
        { name: 'bills_paid_on_time', color: '#ef4444' },
        { name: 'bills_due_unpaid', color: '#3b82f6' },
      ],
      legendTitle: 'On-time payment rate',
      bars: bars,
      hiddenBarLabel: true,
      valueFormat: 'currency',
    },
    withoutExpandHeader: true,
  };
  return <ChartSelectionView charts={onTimePaymentRate} />;
};

export default PayableOnTimePaymentRate;
