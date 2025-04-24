'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import ComposedBaseChart from '@/modules/admin/overview/components/charts/ComposedBaseChart';
import HorizontalBarBaseChart from '@/modules/admin/overview/components/charts/HorizontalBarBaseChart';
import LinearBaseChart from '@/modules/admin/overview/components/charts/LinearBaseChart';
import PieBaseChart from '@/modules/admin/overview/components/charts/PieBaseChart';
import StackedBarChar from '@/modules/admin/overview/components/charts/StackedBarChar';
import VerticalBarChart from '@/modules/admin/overview/components/charts/VerticalBarChart';
import { generateChartConfig } from '@/modules/admin/overview/utils/chart';
import { CustomChartConfig, MultipleChart } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import { FunctionComponent, useState } from 'react';
import StaticCard from '../cards/static-card';

type ChartRenderingProps = {
  charts: MultipleChart[];
  direction?: 'horizontal' | 'vertical';
};

type RenderChartsProps = CustomChartConfig & {
  type: 'linear' | 'pastel' | 'bar' | 'composed' | 'stackedBar' | 'multiple';
  data: DataSeries[];
  title?: string;
  position?: 'vertical' | 'horizontal';
};

const ChartRendering: FunctionComponent<ChartRenderingProps> = ({
  charts,
  direction = 'vertical',
}) => {
  const [chartSelected, setChartSelected] = useState<MultipleChart | null>(
    charts[0],
  );
  const renderChart = ({
    data,
    type,
    title,
    position,
    ...config
  }: RenderChartsProps) => {
    switch (type) {
      case 'linear':
        return <LinearBaseChart {...{ data, title: title ?? '' }} />;
      case 'pastel':
        return (
          <PieBaseChart
            data={data}
            config={generateChartConfig(data)}
            {...config}
          />
        );
      case 'bar':
        return position === 'horizontal' ? (
          <HorizontalBarBaseChart
            {...{ data, config: generateChartConfig(data) }}
          />
        ) : (
          <VerticalBarChart
            {...{ data, config: generateChartConfig(data), ...config }}
          />
        );
      case 'composed':
        return (
          <ComposedBaseChart
            {...{ data, config: generateChartConfig(data), ...config }}
          />
        );
      case 'stackedBar':
        return (
          <StackedBarChar
            {...{
              data,
              config: generateChartConfig(data),
              direction,
              ...config,
            }}
          />
        );
      case 'multiple':
        return config.children ?? null;
    }
  };
  return (
    <div
      className={`flex gap-4 ${direction === 'horizontal' ? '' : 'flex-col'} w-full`}
    >
      <div
        className={`grid ${direction === 'horizontal' ? 'grid-cols-2' : 'grid-cols-4'} flex-1 gap-4`}
      >
        {charts.map((chart) => (
          <StaticCard
            title={chart.title}
            value={chart.value}
            content={chart.content}
            description={chart.description}
            valueFormat={chart.valueFormat}
            key={`chart-${chart.chartType}-${chart.title}`}
            expandible={chart.expandible}
            onExpand={() => setChartSelected(chart)}
            className="w-full"
            icon={chart.icon}
          />
        ))}
      </div>

      {chartSelected && chartSelected.chartType && chartSelected.data && (
        <Card className="flex-1">
          {!chartSelected.withoutExpandHeader && (
            <CardHeader>
              <CardTitle>
                {chartSelected.expandTitle ?? chartSelected.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {chartSelected.subtitle}
              </CardDescription>
            </CardHeader>
          )}

          <CardContent>
            {renderChart({
              ...chartSelected.config,
              type: chartSelected.chartType,
              data: chartSelected.data,
              title: chartSelected.title,
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChartRendering;
