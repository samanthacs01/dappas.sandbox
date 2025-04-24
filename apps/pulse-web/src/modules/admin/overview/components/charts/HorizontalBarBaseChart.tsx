'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/core/components/ui/chart';
import { DataSeries } from '@/server/types/overview';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

type LinearBaseChartProps = {
  data: DataSeries[];
  title?: string;
  config?: ChartConfig;
};

const HorizontalBarBaseChart: React.FC<LinearBaseChartProps> = ({
  data,
  title,
  config,
}) => {
  return (
    <ChartContainer
      config={config ?? { name: { label: title } }}
      className="mx-auto aspect-square max-h-[250px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="value"
          layout="vertical"
          fill="var(--color-desktop)"
          radius={4}
          animationDuration={300}
          animationEasing="ease-in"
        >
          <LabelList
            dataKey="name"
            position="insideLeft"
            offset={8}
            className="fill-[--color-label]"
            fontSize={12}
          />
          <LabelList
            dataKey="value"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarBaseChart;
