'use client';

import { paths } from '@/core/lib/routes';
import { parsePathname } from '@/core/lib/utils';
import { detailsTabs } from '@/modules/admin/payable/libs/utils/detailsTabs';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import TabPanels from '@/modules/commons/tab-panels/TabPanels';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';

export const ProductionDetailsTabPanelContainer: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();

  const onChangeTab = (tab: string) => {
    if (tab === 'bills') {
      router.push(
        parsePathname(paths.payable.productions.details.bills, {
          id: id as string,
        }),
      );
    } else {
      router.push(
        parsePathname(paths.payable.productions.details.overview, {
          id: id as string,
        }),
      );
    }
  };

  const currentTab: string = useMemo(
    () =>
      pathname ===
      parsePathname(paths.payable.productions.details.overview, {
        id: id as string,
      })
        ? 'overview'
        : 'bills',
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
