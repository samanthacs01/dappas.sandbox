'use client';

import { paths } from '@/core/lib/routes';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import TabPanels from '@/modules/commons/tab-panels/TabPanels';
import { detailsTabs } from '@/modules/production/components/detailsTabs';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';

export const ProductionDetailsTabPanelContainer: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const onChangeTab = (tab: string) => {
    if (tab === 'bills') {
      router.push(paths.production.details.bills);
    } else {
      router.push(paths.production.details.overview);
    }
  };

  const currentTab: string = useMemo(
    () =>
      pathname === paths.production.details.overview ? 'overview' : 'bills',
    [pathname],
  );

  return (
    <div className="flex justify-between items-center w-full">
      <TabPanels
        {...{
          tabs: detailsTabs,
          currentTab,
          onChangeTab,
        }}
      />
      {currentTab === 'overview' && <DateRangeFilter />}
    </div>
  );
};
