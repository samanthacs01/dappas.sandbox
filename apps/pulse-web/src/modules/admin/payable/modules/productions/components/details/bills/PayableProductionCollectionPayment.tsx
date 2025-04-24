'use client';

import useUrlParams, { UrlParamsType } from '@/core/hooks/use-url-params';
import { billingTypeTabs } from '@/modules/admin/payable/libs/utils/billingTypeTabs';
import TabPanels from '@/modules/commons/tab-panels/TabPanels';
import { useSearchParams } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

export const PayableProductionCollectionPayment: FC<PropsWithChildren> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const { updateSearchParams } = useUrlParams();

  const currentTab = searchParams.get('table');

  const onChangeTab = (value: string) => {
    const updates: UrlParamsType[] = [];
    searchParams.entries().map(([key]) => {
      updates.push({
        [key]: {
          action: 'delete',
          value: '',
        },
      });
    });
    updates.push({
      table: {
        action: 'set',
        value,
      },
    });
    updateSearchParams(updates);
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
