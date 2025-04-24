import ChartStatsDisplayContainer from '@/core/components/common/chart/chart-stats-display';
import { valueFormatter } from '@/core/lib/numbers';
import { ChartStatsDisplay } from '@/server/types/chart';
import { ProductionsOverviewStatsType } from '@/server/types/payable';
import { DollarSign } from 'lucide-react';
import { FC } from 'react';
import AverageMonthly from './AverageMonthly';

type Props = {
  stats: ProductionsOverviewStatsType;
};

const ProductionsOverviewStats: FC<Props> = ({ stats }) => {
  const data: ChartStatsDisplay[] = [
    {
      title: 'Booking',
      valueFormat: 'currency',
      value: stats.total_booked,
      expandible: true,
      icon: <DollarSign width={16} height={16} />,

      chartName: 'booking',
    },
    {
      title: 'Net revenue',
      valueFormat: 'currency',
      value: stats.net_revenue,
      expandible: true,
      icon: <DollarSign width={16} height={16} />,

      chartName: 'net-revenue',
    },
    {
      title: 'Next payment date and amount',
      description: valueFormatter(stats.next_payment_date, 'date'),
      valueFormat: 'currency',
      value: stats.next_payment_amount,
    },
    {
      title: 'Average monthly revenue',
      valueFormat: 'currency',
      content: (
        <AverageMonthly
          amount={stats.average_monthly_revenue}
          variance={stats.monthly_variance}
        />
      ),
      expandible: false,
    },
  ];
  return (
    <ChartStatsDisplayContainer chartNameKey="production_chart" stats={data} />
  );
};

export default ProductionsOverviewStats;
