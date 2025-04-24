'use client';
import ChartRendering from '@/core/components/common/chart/chart-rendering';
import { DateRangePicker } from '@/core/components/common/date-picker';
import { receivableChartConfig } from './ReceivableChartConfig';

const PayableOverview = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>Overview</h3>
        <DateRangePicker />
      </div>
      <ChartRendering charts={receivableChartConfig} />
    </div>
  );
};

export default PayableOverview;
