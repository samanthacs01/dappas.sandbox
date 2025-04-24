'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import ReactJsonView from '@microlink/react-json-view';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import useUrlParams from '@/core/hooks/use-url-params';

const ActivityLogsModalContainer = () => {
  const { theme } = useTheme();
  const { updateSearchParams } = useUrlParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<Record<string, unknown>>({});
  const current_modal = searchParams.get('current_modal');

  const handleOnClose = useCallback(() => {
    updateSearchParams({
      current_modal: { action: 'delete', value: 'view-json' },
    });
    localStorage.removeItem('local-activity-logs');
  }, [updateSearchParams]);

  useEffect(() => {
    if (current_modal === 'view-json') {
      const storedData = localStorage.getItem('local-activity-logs');
      if (storedData) {
        try {
          setData(JSON.parse(storedData));
        } catch (error) {
          console.error('Error parsing stored data:', error);
          setData({});
        }
      }
    }
  }, [current_modal]);

  const isOpen = current_modal === 'view-json';

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}>
      <DialogContent
        aria-describedby="view-logs-data"
        className="w-full max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>View logs data</DialogTitle>
        </DialogHeader>
        {isOpen && (
          <ReactJsonView
            src={data}
            displayDataTypes={false}
            iconStyle="square"
            collapseStringsAfterLength={20}
            enableClipboard={false}
            theme={theme === 'dark' ? 'shapeshifter' : 'shapeshifter:inverted'}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActivityLogsModalContainer;
