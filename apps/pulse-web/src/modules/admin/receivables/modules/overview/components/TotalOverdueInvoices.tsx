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

const TotalOverdueInvoices: FC<Props> = ({ data }) => {
  const desiredOrder = [
    'Current',
    '0-30 Days',
    '31-60 Days',
    '61-90 Days',
    '+90 Days',
  ];
  const sortedData = data.sort((a, b) => {
    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
  });

  const totalOverdue: DataSeries[] = sortedData.map((item) => {
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

  const bars: string[] = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== 'name')),
    ),
  );

  const bookingChart: ChartSelectedDisplay = {
    chartType: 'stackedBar',
    data: totalOverdue,
    title: 'Total overdue amount',
    config: {
      legend: false,
      bars: bars,
      valueFormat: 'currency',
      hiddenBarLabel: true,
    },
  };
  return <ChartSelectionView charts={bookingChart} />;
};

export default TotalOverdueInvoices;
