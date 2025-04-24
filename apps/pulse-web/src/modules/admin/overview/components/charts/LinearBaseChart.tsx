'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/core/components/ui/chart';
import { DataSeries } from '@/server/types/overview';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

type LinearBaseChartProps = {
  data: DataSeries[];
  title: string;
  color?: string;
};

const LinearBaseChart: React.FC<LinearBaseChartProps> = ({
  data,
  title,
  color = 'hsl(var(--chart-1))',
}) => {
  return (
    <ChartContainer
      config={{
        name: {
          label: title,
          color: color,
        },
      }}
      className="mx-auto aspect-square max-h-[250px] w-full"
    >
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="value"
          type="linear"
          stroke="var(--color-name )"
          strokeWidth={2}
          dot={false}
          animationDuration={300}
          animationEasing="ease-in"
        />
      </LineChart>
    </ChartContainer>
  );
};

export default LinearBaseChart;
