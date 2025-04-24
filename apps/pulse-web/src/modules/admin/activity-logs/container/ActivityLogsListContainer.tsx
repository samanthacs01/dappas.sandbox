import { getActivityLogs } from '@/server/services/logs';
import { SearchParams } from '@/server/types/params';
import React from 'react';
import ActivityLogsTable from '../components/list/ActivityLogsTable';

type LogsContainerProps = {
  searchParams: SearchParams;
};

const ActivityLogsListContainer = async ({
  searchParams,
}: LogsContainerProps) => {
  const { items, pagination } = await getActivityLogs(searchParams);
  return <ActivityLogsTable {...{ data: items ?? [], pagination }} />;
};

export default ActivityLogsListContainer;
