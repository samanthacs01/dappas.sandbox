'use client';
import { Tabs, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { AdditionalData, TabType } from '@/server/types/tabs';
import { FunctionComponent } from 'react';

interface TabsActionsProps {
  tabs: TabType[];
  className?: string;
  defaultValue?: string;
  onChangeTab?: (value: string) => void;
  currentTab?: TabType['value'];
  additionalData?: AdditionalData;
}

const TabPanels: FunctionComponent<TabsActionsProps> = ({
  tabs,
  className,
  defaultValue,
  onChangeTab,
  currentTab,
  additionalData,
}) => {
  return (
    <Tabs defaultValue={defaultValue} className={className} value={currentTab}>
      <div className="flex place-content-between">
        <TabsList>
          {tabs.map((tabs, index) => (
            <TabsTrigger
              onClick={() => onChangeTab?.(tabs.value)}
              key={tabs.value}
              value={tabs.value}
            >
              <div className="flex gap-2">
                {tabs.label} {additionalData?.[tabs.value]}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default TabPanels;
