import { DataSeries } from './overview';
/**
 * Using for render multiples charts in one component
 */

export type MultipleChart = {
  data?: DataSeries[];
  chartType?:
    | 'linear'
    | 'pastel'
    | 'bar'
    | 'composed'
    | 'stackedBar'
    | 'multiple';
  title?: string;
  description?: string;
  subtitle?: string;
  withoutExpandHeader?: boolean;
  expandTitle?: string;
  value?: number;
  content?: React.ReactNode;
  valueFormat?: 'number' | 'currency' | 'percentage';
  expandible?: boolean;
  position?: 'vertical' | 'horizontal';
  config?: CustomChartConfig;
  icon?: React.ReactNode;
};

export type CustomChartConfig = {
  legend?: boolean;
  expandible?: boolean;
  position?: 'vertical' | 'horizontal';
  tooltip?: boolean;
  valueFormat?: 'number' | 'currency' | 'percentage';
  legendValues?: LegendValues[];
  legendTitle?: string;
  bars?: string[];
  children?: React.ReactNode;
  hiddenBarLabel?: boolean;
  unRotateXLabel?: boolean;
};

export type LegendValues = {
  name: string;
  color: string;
};

export type ReceivedChart = {
  label: string;
  value: number;
  grouping_details?: string;
  composed_value?: number;
};
export type ReceivedOverdueChart = {
  name: string;
} & Record<string, number>;

export type ChartStatsDisplay = {
  title?: string;
  expandible?: boolean;
  value?: number;
  content?: React.ReactNode;
  valueFormat?: 'number' | 'currency' | 'percentage';
  icon?: React.ReactNode;
  description?: string;
  chartName?: string;
};

export type ChartSelectedDisplay = {
  data?: DataSeries[];
  chartType: 'linear' | 'pie' | 'bar' | 'composed' | 'stackedBar' | 'multiple';
  subtitle?: string;
  withoutExpandHeader?: boolean;
  config?: CustomChartConfig;
  title?: string;
  expandTitle?: string;
};
