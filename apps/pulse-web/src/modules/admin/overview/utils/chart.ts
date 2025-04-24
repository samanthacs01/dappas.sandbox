import { ChartConfig } from '@/core/components/ui/chart';
import { DataSeries } from '@/server/types/overview';

export const generateChartConfig = (data: DataSeries[]): ChartConfig => {
  // iterate over data and return a object with data.name like the key and value is {label: data.name, color: use hsl(var(--chart-))}

  return data.reduce((acc, data, index) => {
    acc[data.name] = {
      label: data.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);
};

export const getLighterColor = (color: string) => {
  const hslMatch = color.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/);
  if (hslMatch) {
    const [_, h, s, l] = hslMatch;
    return `hsl(${h}, ${s}%, ${Math.min(parseInt(l) + 20, 100)}%)`;
  }
  return color;
};

export const stringToHexColor = (str: string): string => {
  if (!str) {
    return 'hsl(var(--chart-1))';
  }

  const repeatedStr = str.repeat(7);

  let hash = 0;

  for (const char of repeatedStr) {
    hash = char.charCodeAt(0) + ((hash << 7) - hash);
  }

  return (
    '#' + (((hash >> 0) & 0xffffff) ^ 0x888888).toString(16).padStart(6, '0')
  );
};

export const parseToDataKey = (
  value: string,
  onlyReplaceSpaceWithUnderscore = false,
) =>
  value
    ?.toLowerCase()
    .replace(onlyReplaceSpaceWithUnderscore ? /\s/g : /[.\s]/g, '_')
    .replace('-', '_')
    .replace(/[^\w\s]/gi, '');
