'use server';

import { QueryParamsURLFactory } from '@/core/lib/request';
import { ActivityLogs } from '../types/logs';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import { BACKEND_ROUTES } from './endpoints';
import { fetcher } from '@/core/lib/result-fetcher';

export const getActivityLogs = async (
  params: SearchParams,
): Promise<PaginatedData<ActivityLogs>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.logs.list,
    params,
  ).build();

  const res = await fetcher<PaginatedData<ActivityLogs>>(url, {
    method: 'GET',
  });

  if (!res.success || !res.data) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }
  return res.data;
};
