import { valueFormatter } from '@/core/lib/numbers';
import React from 'react';
import { LabelProps } from 'recharts';

const isColorDark = (color: string) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};
export const CustomChartLabel = (
  props: LabelProps & { valueFormat?: 'number' | 'currency' | 'percentage' },
) => {
  const { x, y, width, height, value, fill } = props;

  if (!value || Number(value) <= 0) return null;

  const textColor = isColorDark(fill as string) ? 'white' : 'black';
  return (
    <text
      x={Number(x ?? 0) + Number(width ?? 0) / 2}
      y={Number(y ?? 0) + Number(height ?? 0) / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fill={textColor}
      className="text-xs font-medium"
    >
      {valueFormatter(value ?? '', props.valueFormat ?? 'number')}
    </text>
  );
};
