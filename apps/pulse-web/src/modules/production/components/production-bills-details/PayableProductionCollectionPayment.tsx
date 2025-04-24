'use client';

import useUrlParams from '@/core/hooks/use-url-params';
import { billingTypeTabs } from '@/modules/admin/payable/libs/utils/billingTypeTabs';
import TabPanels from '@/modules/commons/tab-panels/TabPanels';
import { useSearchParams } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';



export const PayableProductionCollectionPayment: FC<PropsWithChildren> = ({children}) => {
  const searchParams = useSearchParams();
  const { updateSearchParams } = useUrlParams();

  const currentTab = searchParams.get('table');

  const onChangeTab = (value: string) => {
    updateSearchParams({
      table: {
        action: 'set',
        value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <TabPanels
        {...{
          tabs: billingTypeTabs,
          currentTab: currentTab ?? 'flights',
          onChangeTab,
        }}
      />
      {children}
      
    </div>
  );
};
