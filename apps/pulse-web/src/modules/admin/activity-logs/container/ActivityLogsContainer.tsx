import { SearchParams } from '@/server/types/params';
import React, { Suspense } from 'react';
import ActivityLogsListContainer from './ActivityLogsListContainer';
import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';

type LogsContainerProps = {
  searchParams: SearchParams;
};

const ActivityLogsContainer = ({ searchParams }: LogsContainerProps) => {
  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Logs list</h3>

      <Suspense fallback={<TableSkeletonFilters filters={4} />}>
        <ActivityLogsListContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
};

export default ActivityLogsContainer;
