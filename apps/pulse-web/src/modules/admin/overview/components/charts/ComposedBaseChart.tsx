import { ChartConfig, ChartContainer } from '@/core/components/ui/chart';
import { CustomChartConfig } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import React, { FunctionComponent } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LegendProps, TooltipProps } from './PieBaseChart';
import { valueFormatter } from '@/core/lib/numbers';
import CustomXAxisTick from './CustomXAxisTick';

type LinearBaseChartProps = CustomChartConfig & {
  data: DataSeries[];
  title?: string;
  config?: ChartConfig;
};

const ComposedBaseChart: FunctionComponent<LinearBaseChartProps> = ({
  data,
  config,
  title,
  ...rest
}) => {
  const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
    if (!payload) return null;
    return (
      <div className="flex flex-col gap-2 py-4 mb-4">
        <h3 className="font-semibold text-base">
          {rest.legendTitle ?? 'Legend'}
        </h3>
        <ul className="flex items-center gap-4">
          {rest.legendValues?.map((legend, index) => (
            <li key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded"
                style={{ backgroundColor: legend.color }}
              />
              <span className="text-sm">{legend.name}</span>
              <span className="text-sm ml-2"></span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="space-y-1 bg-primary-foreground p-2 rounded-lg">
        <div className="flex justify-between items-center gap-8">
          <div className="flex gap-1 items-center">
            <div
              className="h-2 w-2 rounded-[2px]"
              style={{
                backgroundColor: (payload[0] as unknown as { color: string })
                  .color,
              }}
            />
            <p>{payload[0].payload?.details ?? payload[0].payload?.name}</p>
          </div>
          <p className="font-semibold">
            {valueFormatter(
              payload[0].payload?.value as number,
              rest.valueFormat ?? 'number',
            )}
          </p>
        </div>
        <div className="flex justify-between items-center gap-8">
          <div className="flex gap-1 items-center">
            <div
              className="h-2 w-2 rounded-[2px]"
              style={{
                backgroundColor: '#ff7300',
              }}
            />
            <p>Overall Avg</p>
          </div>
          <p className="font-semibold">
            {valueFormatter(
              payload[0].payload?.composed_value as number,
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
      className="mx-auto aspect-square max-h-[328px] min-h-[328px] w-full"
    >
      <ComposedChart data={data} margin={{ top: 20, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} />
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
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        {rest.legend && (
          <Legend verticalAlign="top" content={<CustomLegend />} />
        )}
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
              fontSize={12}
            />
          )}
        </Bar>
        <Line
          type="monotone"
          dataKey="composed_value"
          stroke="#ff7300"
          strokeWidth={2}
          animationDuration={300}
          animationEasing="ease-in"
        />
      </ComposedChart>
    </ChartContainer>
  );
};

export default ComposedBaseChart;
