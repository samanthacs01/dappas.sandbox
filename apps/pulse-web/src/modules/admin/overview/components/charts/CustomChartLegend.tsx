import { FC } from 'react';
import { LegendProps } from './PieBaseChart';
import { parseToDataKey } from '../../utils/chart';

export const CustomChartLegend: FC<
  LegendProps & {
    bars?: string[];
    legendTitle?: string;
    direction?: 'vertical' | 'horizontal';
  }
> = ({ payload, bars, legendTitle, direction }) => {
  if (!payload) return null;
  return (
    <div className={`flex flex-col ${direction !== 'horizontal' && ''} py-4`}>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-base">{legendTitle ?? 'Legend'}</h3>
        <ul className={`flex flex-wrap gap-2`}>
          {payload.map((entry, index: number) => (
            <li key={`item-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">
                {bars?.find((bar) => parseToDataKey(bar) === entry.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
