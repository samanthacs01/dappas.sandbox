import ChartStatsDisplayContainer from '@/core/components/common/chart/chart-stats-display';
import { ChartStatsDisplay } from '@/server/types/chart';
import { PayableOverviewStats } from '@/server/types/payable';
import { DollarSign, Percent } from 'lucide-react';
import { FC } from 'react';

type Props = {
  stats: PayableOverviewStats;
  direction?: 'horizontal' | 'vertical';
};

const PayableInsightsOverview: FC<Props> = async ({ stats, direction }) => {
  const bookingStats: ChartStatsDisplay[] = [
    {
      title: 'Total payables outstanding',
      valueFormat: 'currency',
      expandible: true,
      icon: <DollarSign width={16} height={16} />,
      chartName: 'total-payables-outstanding',
      value: stats.total_outstanding,
    },
    {
      title: 'Total overdue bills',
      value: stats.total_overdue,
      icon: <DollarSign width={16} height={16} />,
      valueFormat: 'currency',
      expandible: true,
      chartName: 'total-overdue-bills',
    },
    {
      title: 'On-time payment rate',
      icon: <Percent width={16} height={16} />,
      value: stats.on_time_payment_rate,
      valueFormat: 'percentage',
      expandible: true,
      chartName: 'on-time-payment-rate',
    },
    {
      title: 'Production payment on uncollected invoices',
      icon: <DollarSign width={16} height={16} />,
      value: stats.production_payment_on_uncollected_invoices,
      valueFormat: 'currency',
      expandible: true,
      chartName: 'production-payment',
    },
  ];
  return (
    <ChartStatsDisplayContainer
      stats={bookingStats}
      direction={direction}
      chartNameKey="payable_chart"
    />
  );
};

export default PayableInsightsOverview;
