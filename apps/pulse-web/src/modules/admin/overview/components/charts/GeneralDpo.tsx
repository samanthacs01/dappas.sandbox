import ChartSelectionView from '@/core/components/common/chart/chart-selection-view';
import { parseToChartType } from '@/modules/admin/booking/utils/parsers';
import { ChartSelectedDisplay, ReceivedChart } from '@/server/types/chart';
import { FC } from 'react';

type Props = {
  data: ReceivedChart[];
};

const GeneralDpo: FC<Props> = ({ data }) => {
  const dpoChart: ChartSelectedDisplay = {
    chartType: 'composed',
    data: parseToChartType(data),
    withoutExpandHeader: true,
    config: {
      legend: true,
      legendTitle: 'Days payable outstanding (DPO)',
      legendValues: [
        { name: 'Average DPO (Days)', color: '#3B82F6' },
        { name: 'Overall Avg DPO', color: '#E76E50' },
      ],
      valueFormat: 'number',
    },
  };

  return <ChartSelectionView charts={dpoChart} />;
};

export default GeneralDpo;
