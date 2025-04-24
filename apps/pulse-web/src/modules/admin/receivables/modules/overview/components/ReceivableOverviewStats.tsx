import ChartStatsDisplayContainer from '@/core/components/common/chart/chart-stats-display';
import { valueFormatter } from '@/core/lib/numbers';
import { ChartStatsDisplay } from '@/server/types/chart';
import { ReceivableOverviewStats } from '@/server/types/receivables';
import { DollarSign, Percent } from 'lucide-react';
import { FC } from 'react';

type Props = {
  stats: ReceivableOverviewStats;
  direction?: 'horizontal' | 'vertical';
};

const ReceivableStats: FC<Props> = ({ stats, direction }) => {
  const receivableStats: ChartStatsDisplay[] = [
    {
      title: 'Total receivables outstanding',
      value: stats.total_outstanding,
      valueFormat: 'currency',
      expandible: true,
      icon: <DollarSign width={16} height={16} />,
      chartName: 'total_outstanding',
    },

    {
      title: 'Total overdue amount',
      icon: <DollarSign width={16} height={16} />,
      content: (
        <p className="text-2xl font-bold">
          {valueFormatter(stats.total_overdue, 'currency')}
        </p>
      ),
      valueFormat: 'currency',
      expandible: true,
      chartName: 'overdue-invoices',
    },
    {
      icon: <Percent width={16} height={16} />,
      title: 'Collection rate',
      description: 'Overall/Within p. terms',
      content: (
        <div className="flex items-center gap-1">
          <p className="text-2xl font-bold">
            {valueFormatter(stats.collection_rate, 'percentage')}
          </p>
          <span className="text-muted-foreground font-bold text-2xl">/</span>
          <p className="text-2xl font-bold">
            {valueFormatter(stats.collection_with_payment_terms, 'percentage')}
          </p>
        </div>
      ),
      expandible: true,
      chartName: 'collection-rate',
    },
    {
      title: 'Customer concentration',
      icon: <Percent width={16} height={16} />,
      value: stats.customer_concentration,
      valueFormat: 'percentage',
      expandible: true,
      chartName: 'customer-concentration',
    },
  ];

  return (
    <ChartStatsDisplayContainer
      stats={receivableStats}
      direction={direction}
      chartNameKey="receivable_chart"
    />
  );
};

export default ReceivableStats;
