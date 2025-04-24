'use client';

import { ChartConfig, ChartContainer } from '@/core/components/ui/chart';
import { valueFormatter } from '@/core/lib/numbers';
import { CustomChartConfig } from '@/server/types/chart';
import { DataSeries } from '@/server/types/overview';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';
import { stringToHexColor } from '../../utils/chart';
import React from 'react';

type PieBaseChartProps = CustomChartConfig & {
  data: DataSeries[];
  config: ChartConfig;
};

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: DataSeries;
  }>;
}

export interface LegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: DataSeries;
  }>;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  name: string;
  value: number;
}

const PieBaseChart: React.FC<PieBaseChartProps> = ({
  data,
  config,
  ...rest
}) => {
  const { legend = true, tooltip = true, valueFormat = 'number' } = rest;

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="space-y-1 bg-primary-foreground p-2 rounded-lg">
          <div className="flex justify-between items-center gap-8">
            <div className="flex gap-1 items-center">
              <div
                style={{
                  backgroundColor:
                    payload[0].payload?.color ??
                    stringToHexColor(
                      payload[0].payload?.name ?? rest.bars?.[0] ?? '',
                    ),
                }}
                className="h-2 w-2 rounded-[2px]"
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
        </div>
      );
    }
    return null;
  };

  const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
    if (!payload) return null;
    return (
      <ul className="flex flex-col space-y-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
            <span className="text-sm ml-2">
              {valueFormatter(entry.payload.value ?? 0, valueFormat)}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomLabel: React.FC<CustomLabelProps> = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // Reduced from 25 to make lines shorter
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const pieEdgeX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const pieEdgeY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    const formattedValue = valueFormatter(value, valueFormat);
    const truncateText = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength - 3) + '...';
    };

    const maxLength = 15;
    const truncatedText = truncateText(name, maxLength);
    return (
      <g>
        <line
          x1={pieEdgeX}
          y1={pieEdgeY}
          x2={x}
          y2={y}
          stroke={stringToHexColor(name) ?? '#000000'}
          strokeWidth={1}
        />
        <text
          x={x + (x > cx ? 10 : -10)}
          y={y}
          fontSize={10}
          textAnchor={x > cx ? 'start' : 'end'}
          className="flex items-center gap-1 text-ellipsis overflow-hidden max-w-1 fill-primary"
        >
          {truncatedText} {formattedValue}
        </text>
      </g>
    );
  };

  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square max-h-[320px] w-full"
    >
      <PieChart width={192} height={192}>
        {tooltip && <Tooltip content={<CustomTooltip />} />}

        {legend && (
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              lineHeight: '24px',
              right: 0,
              width: 'auto',
              paddingLeft: '10px',
            }}
            content={<CustomLegend />}
          />
        )}
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          labelLine={false}
          animationDuration={300}
          animationEasing="ease-in-out"
          label={(props) => <CustomLabel {...props} />}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={stringToHexColor(entry.name)} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default PieBaseChart;
