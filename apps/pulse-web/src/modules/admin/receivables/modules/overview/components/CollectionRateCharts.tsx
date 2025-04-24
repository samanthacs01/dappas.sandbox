import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import PieBaseChart from '@/modules/admin/overview/components/charts/PieBaseChart';
import { generateChartConfig } from '@/modules/admin/overview/utils/chart';
import { DataSeries } from '@/server/types/overview';
import { FC, useState } from 'react';

type CollectionOverallProps = {
  overallRate: DataSeries[];
  withPayment: DataSeries[];
};
type TabType = 'overall' | 'withPayment';
const CollectionRateCharts: FC<CollectionOverallProps> = ({
  overallRate,
  withPayment,
}) => {
  const [tab, setTab] = useState<TabType>('overall');

  const allValuesAreZero =
    overallRate.every((item) => item.value === 0) &&
    withPayment.every((item) => item.value === 0);

  if (allValuesAreZero) {
    return (
      <h3 className="text-center text-lg text-muted-foreground ">
        No data available
      </h3>
    );
  }
  const dataToView = tab !== 'overall' ? withPayment : overallRate;

  return (
    <div className="flex flex-col gap-2 p-6 w-full">
      <Tabs
        defaultValue={tab}
        onValueChange={(value) => setTab(value as TabType)}
      >
        <TabsList>
          <TabsTrigger value="overall">Collection Overall</TabsTrigger>
          <TabsTrigger value="withPayment">Within Payment Terms</TabsTrigger>
        </TabsList>
      </Tabs>
      <PieBaseChart
        data={dataToView}
        config={generateChartConfig(dataToView)}
        legend={false}
        valueFormat="percentage"
      />
    </div>
  );
};

export default CollectionRateCharts;
