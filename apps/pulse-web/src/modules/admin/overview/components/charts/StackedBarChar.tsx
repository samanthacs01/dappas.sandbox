'use client';
import { ChartConfig, ChartContainer } from '@/core/components/ui/chart';
import { Separator } from '@/core/components/ui/separator';
import { valueFormatter } from '@/core/lib/numbers';
import { CustomChartConfig } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import React, { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { parseToDataKey, stringToHexColor } from '../../utils/chart';
import { CustomChartLabel } from './CustomChartLabel';
import { CustomChartLegend } from './CustomChartLegend';
import CustomXAxisTick from './CustomXAxisTick';
import { TooltipProps } from './PieBaseChart';

export type LinearBaseChartProps = CustomChartConfig & {
  data: DataSeries[];
  title?: string;
  config?: ChartConfig;
  direction?: 'horizontal' | 'vertical';
};

const StackedBarChar: FC<LinearBaseChartProps> = ({
  data,
  config,
  title,
  direction,
  legend,
  ...rest
}) => {
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;

      const tooltipData = Object.entries(data)
        .map(([key, value]) => ({ key, value }))
        .filter((item) => item.key !== 'name')
        .filter((item) => item.value !== 0 || item.key === 'others');

      tooltipData.sort((a, b) =>
        a.key === 'others' ? 1 : b.key === 'others' ? -1 : 0,
      );

      const dataToShow = tooltipData
        .map((item) => {
          const bar = rest.bars?.find(
            (bar) => parseToDataKey(bar) === item.key,
          );
          if (bar) {
            return {
              name: bar,
              value: item.value,
              color: rest.legendValues?.[rest.bars?.indexOf(bar) ?? 0]?.color,
            };
          }
          return null;
        })
        .filter(Boolean);

      return (
        <div className="space-y-2 bg-primary-foreground p-2 rounded-lg">
          <div className="space-y-1">
            {dataToShow.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-8"
              >
                <div className="flex gap-1 items-center">
                  <div
                    style={{
                      backgroundColor:
                        item?.color ??
                        stringToHexColor(item?.name ?? rest.bars?.[0] ?? ''),
                    }}
                    className="h-2 w-2 rounded-[2px]"
                  />
                  <p>{item?.name}</p>
                </div>
                <p className="font-semibold">
                  {valueFormatter(
                    item?.value as number,
                    rest.valueFormat ?? 'number',
                  )}
                </p>
              </div>
            ))}
          </div>
          <Separator />

          <div className="flex justify-between items-center gap-8">
            <div className="flex gap-1 items-center">
              <p className="font-semibold">Total</p>
            </div>
            <p className="font-semibold">
              {valueFormatter(
                dataToShow.reduce(
                  (a, b) => a + (b as { value: number }).value,
                  0,
                ),
                rest.valueFormat ?? 'number',
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <ChartContainer
      config={config ?? { name: { label: title } }}
      className="mx-auto aspect-square max-h-[320px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
        {legend && (
          <Legend
            verticalAlign="top"
            content={
              <CustomChartLegend
                bars={rest.bars}
                legendTitle={rest.legendTitle}
                direction={direction}
              />
            }
          />
        )}

        {rest.bars?.map((bar, index) => {
          const isFirst = index === 0;
          const isLast = index === (rest.bars?.length ?? 0) - 1;

          const radius: [number, number, number, number] = isFirst
            ? [0, 0, 8, 8]
            : isLast
              ? [8, 8, 0, 0]
              : [0, 0, 0, 0];

          return (
            <Bar
              key={index}
              dataKey={parseToDataKey(bar)}
              stackId={'a'}
              fill={rest.legendValues?.[index]?.color ?? stringToHexColor(bar)}
              radius={radius}
              animationDuration={300}
              animationEasing="ease-in"
            >
              {!rest.hiddenBarLabel && (
                <LabelList
                  dataKey={parseToDataKey(bar)}
                  position={'outside'}
                  fill={stringToHexColor(bar)}
                  content={<CustomChartLabel valueFormat={rest.valueFormat} />}
                />
              )}
            </Bar>
          );
        })}
      </BarChart>
    </ChartContainer>
  );
};

export default StackedBarChar;
