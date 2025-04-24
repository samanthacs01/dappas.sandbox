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
import { ChartSelectedDisplay, CustomChartConfig } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import { FC, useCallback } from 'react';

type ChartRenderingProps = {
  charts: ChartSelectedDisplay;
  direction?: 'horizontal' | 'vertical';
};

type RenderChartsProps = CustomChartConfig & {
  type: 'linear' | 'pie' | 'bar' | 'composed' | 'stackedBar' | 'multiple';
  data: DataSeries[];
  title?: string;
  position?: 'vertical' | 'horizontal';
};

const ChartSelectionView: FC<ChartRenderingProps> = ({ charts, direction }) => {
  const isAllZero = charts.data?.every((item) => item.value === 0);
  const hasData = charts.data && charts.data.length > 0;
  const isMultipleChart = charts.chartType === 'multiple';

  const renderChart = useCallback(
    ({ data, type, title, position, ...config }: RenderChartsProps) => {
      switch (type) {
        case 'linear':
          return <LinearBaseChart {...{ data, title: title ?? '' }} />;
        case 'pie':
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
    },
    [charts],
  );
  const NoDataMessage = () => (
    <p className="text-muted-foreground text-lg font-medium">
      No data available
    </p>
  );
  const displayChartOrMessage = () => {
    if (isAllZero && !isMultipleChart) {
      return <NoDataMessage />;
    }

    if (!hasData && !isMultipleChart) {
      return <NoDataMessage />;
    }
    return renderChart({
      ...charts.config,
      type: charts.chartType,
      data: charts.data ?? [],
      title: charts.title,
    });
  };
  return (
    <div className="flex-grow">
      <Card>
        {!charts.withoutExpandHeader && (
          <CardHeader>
            <CardTitle>{charts.expandTitle ?? charts.title}</CardTitle>
            <CardDescription className="text-xs">
              {charts.subtitle}
            </CardDescription>
          </CardHeader>
        )}

        <CardContent className="min-h-[328px] flex flex-col items-center justify-center">
          {displayChartOrMessage()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSelectionView;
