import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const GeneralDso: FC<Props> = ({ data }) => {
  const dsoChart: ChartSelectedDisplay = {
    chartType: 'composed',
    data: parseToChartType(data),
    withoutExpandHeader: true,
    config: {
      legend: true,
      legendTitle: 'Days sales outstanding (DSO)',
      legendValues: [
        { name: 'Average DSO (Days)', color: '#3B82F6' },
        { name: 'Overall Avg DSO', color: '#E76E50' },
      ],
      valueFormat: 'number',
    },
  };

  return <ChartSelectionView charts={dsoChart} />;
};

export default GeneralDso;
