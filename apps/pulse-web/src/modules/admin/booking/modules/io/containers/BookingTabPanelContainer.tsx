'use client';

import { Badge } from '@/core/components/ui/badge';
import { paths } from '@/core/lib/routes';
import useWebSocket from '@/core/providers/web-socket/use-web-socket';
import TabPanels from '@/modules/commons/tab-panels/TabPanels';
import { getPendingDraftsAmount } from '@/server/services/booking';
import { AdditionalData } from '@/server/types/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { bookingTabs } from '../../../utils/data';
import { InsertionOrderUploadButton } from '../components/insertion-orders-table/InsertionOrderUploadButton';

export const BookingTabPanelContainer: FC = () => {
  const [pendingDrafts, setPendingDrafts] = useState<number>(0);
  const router = useRouter();
  const onChangeTab = (tab: string) => {
    router.push(`/booking/${tab}`);
  };

  const pathname = usePathname();

  const { message } = useWebSocket();

  const currentTab =
    pathname === paths.booking.insertion_order ? 'insertion-orders' : 'drafts';

  const pendingDraftUpdated = useMemo(
    () => message?.pending_to_review ?? pendingDrafts,
    [message?.pending_to_review, pendingDrafts],
  );

  const additionalData: AdditionalData = useMemo(
    () => ({
      drafts: !!pendingDraftUpdated && (
        <Badge className="h-4 my-auto text-xs px-1">
          {pendingDraftUpdated > 99 ? '+99' : pendingDraftUpdated}
        </Badge>
      ),
    }),
    [pendingDraftUpdated],
  );

  const getPendingDrafts = async () => {
    const { data } = await getPendingDraftsAmount();
    if (data) {
      setPendingDrafts(data.pending_to_review);
    }
  };

  useEffect(() => {
    getPendingDrafts();
  }, []);

  return (
    <div className="flex justify-between w-full">
      <TabPanels
        {...{
          tabs: bookingTabs,
          currentTab,
          onChangeTab,
          additionalData,
        }}
      />
      <InsertionOrderUploadButton />
    </div>
  );
};
