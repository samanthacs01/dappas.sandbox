'use client';
import useUrlParams from '@/core/hooks/use-url-params';
import { ChartStatsDisplay } from '@/server/types/chart';
import { FC } from 'react';
import StaticCard from '../cards/static-card';

type Props = {
  stats: ChartStatsDisplay[];
  direction?: 'horizontal' | 'vertical';
  chartNameKey: string;
};

const ChartStatsDisplayContainer: FC<Props> = ({
  stats,
  direction = 'vertical',
  chartNameKey,
}) => {
  const { updateSearchParams } = useUrlParams();

  const onExpandChart = (chartName: string) => {
    updateSearchParams({
      [chartNameKey]: { action: 'set', value: `${chartName}` },
    });
  };

  return (
    <div
      className={`grid ${direction === 'horizontal' ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}  gap-4`}
    >
      {stats.map((stat) => (
        <StaticCard
          title={stat.title}
          value={stat.value}
          content={stat.content}
          description={stat.description}
          valueFormat={stat.valueFormat}
          key={`chart-${stat.title}`}
          expandible={stat.expandible}
          onExpand={() => onExpandChart(stat.chartName ?? '')}
          className="w-full"
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default ChartStatsDisplayContainer;
