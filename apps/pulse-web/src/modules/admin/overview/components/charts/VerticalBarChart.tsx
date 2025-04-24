import { ChartConfig, ChartContainer } from '@/core/components/ui/chart';
import { valueFormatter } from '@/core/lib/numbers';
import { CustomChartConfig } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import React, { FunctionComponent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CustomXAxisTick from './CustomXAxisTick';
import { TooltipProps } from './PieBaseChart';

export type LinearBaseChartProps = CustomChartConfig & {
  data: DataSeries[];
  title?: string;
  config?: ChartConfig;
};

const VerticalBarChart: FunctionComponent<LinearBaseChartProps> = ({
  data,
  config,
  title,
  ...rest
}) => {
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    
    return (
      <div className="space-y-1 bg-primary-foreground p-2 rounded-lg">
        <div className="flex justify-between items-center gap-8">
          <div className="flex gap-1 items-center">
            <p>{payload[0].payload?.details ?? payload[0].payload?.name}</p>
          </div>
          <p className="font-semibold">
            {valueFormatter(
              payload[0].payload?.value as number,
              rest.valueFormat ?? 'number',
            )}
          </p>
        </div>
      </div>
    );
  };
  return (
    <ChartContainer
      config={config ?? { name: { label: title } }}
      className="mx-auto aspect-square max-h-[320px] w-full"
    >
      <BarChart
        accessibilityLayer
        layout="horizontal"
        data={data}
        margin={{ top: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={0}
          tick={(props) => (
            <CustomXAxisTick
              {...props}
              dataLength={data.length}
              unRotateXLabel={rest.unRotateXLabel}
            />
          )}
        />
        <Tooltip content={<CustomTooltip />} />

        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: unknown) => {
            return valueFormatter(
              value as string | number,
              rest.valueFormat ?? 'number',
              { notation: 'compact' },
            );
          }}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />

        <Bar
          dataKey="value"
          fill="#3B82F6"
          radius={6}
          animationDuration={300}
          animationEasing="ease-in"
        >
          {!rest.hiddenBarLabel && (
            <LabelList
              position="top"
              offset={10}
              className="fill-foreground"
              fontSize={10}
              formatter={(value: unknown) => {
                return valueFormatter(
                  value as string | number,
                  rest.valueFormat ?? 'number',
                );
              }}
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default VerticalBarChart;
