import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import {
  ChartSelectedDisplay,
  ReceivedOverdueChart,
} from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import { FC } from 'react';
import { parseToDataKey } from '../../utils/chart';

type Props = {
  data: ReceivedOverdueChart[];
};

const GeneralGrossMargin: FC<Props> = ({ data }) => {
  const grossMargin: DataSeries[] = data.map((item) => {
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

  const total_overdue: ChartSelectedDisplay = {
    chartType: 'stackedBar',
    data: grossMargin,
    title: 'Gross Margin',
    config: {
      legend: false,
      legendValues: [
        { name: 'profit', color: '#ef4444' },
        { name: 'paid_to_production', color: '#3b82f6' },
      ],
      valueFormat: 'currency',
      bars: bars,
      hiddenBarLabel: true,
    },
  };

  return <ChartSelectionView charts={total_overdue} />;
};

export default GeneralGrossMargin;
