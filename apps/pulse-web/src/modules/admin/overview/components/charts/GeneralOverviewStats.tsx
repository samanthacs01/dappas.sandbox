import ChartStatsDisplayContainer from '@/core/components/common/chart/chart-stats-display';
import { ChartStatsDisplay } from '@/server/types/chart';
import { GeneralOverviewStatsDTO } from '@/server/types/overview';
import { Calendar, DollarSign, Percent } from 'lucide-react';
import { FC } from 'react';

type GeneralStatsProps = {
  generalStats: GeneralOverviewStatsDTO;
};

const GeneralOverviewStats: FC<GeneralStatsProps> = ({ generalStats }) => {
  const stats: ChartStatsDisplay[] = [
    {
      chartName: 'total-revenue',
      value: generalStats.total_revenue,
      icon: <DollarSign width={16} height={16} />,
      title: 'Revenue',
      valueFormat: 'currency',
      expandible: true,
    },
    {
      chartName: 'gross-margin',
      value: generalStats.gross_margin,
      icon: <Percent width={16} height={16} />,
      title: 'Gross margin',
      valueFormat: 'percentage',
      expandible: true,
    },
    {
      chartName: 'days-sales-outstanding',
      value: generalStats.dso,
      icon: <Calendar width={16} height={16} />,
      title: 'Days sales outstanding',
      valueFormat: 'number',
      expandible: true,
    },
    {
      chartName: 'days-payable-outstanding',
      value: generalStats.dpo,
      icon: <Calendar width={16} height={16} />,
      title: 'Days payable outstanding',
      valueFormat: 'number',
      expandible: true,
    },
  ];
  return (
    <ChartStatsDisplayContainer
      chartNameKey="general_chart"
      stats={stats}
      direction="horizontal"
    />
  );
};

export default GeneralOverviewStats;
