'use server';

import { QueryParamsURLFactory } from '@/core/lib/request';
import { fetcher } from '@/core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { ReceivedChart, ReceivedOverdueChart } from '../types/chart';
import { GeneralOverviewStatsDTO } from '../types/overview';
import { SearchParams } from '../types/params';
import { BACKEND_ROUTES } from './endpoints';

export const getGeneralOverviewStats = async (
  params: SearchParams,
): Promise<ResultObject<GeneralOverviewStatsDTO | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.overview.generalStats,
    params,
  ).build();

  return (
    await fetcher<GeneralOverviewStatsDTO>(url, {
      method: 'GET',
    })
  ).toJSON();
};

export const getTotalRevenue = async (
  params: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.overview.total_revenue,
    params,
  ).build();

  return (
    await fetcher<ReceivedChart[]>(url, {
      method: 'GET',
    })
  ).toJSON();
};

export const getGrossMargin = async (
  params: SearchParams,
): Promise<ResultObject<ReceivedOverdueChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.overview.gross_margin,
    params,
  ).build();

  return (
    await fetcher<ReceivedOverdueChart[]>(url, {
      method: 'GET',
    })
  ).toJSON();
};
export const getDaysSalesOutstanding = async (
  params: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.overview.dso,
    params,
  ).build();

  return (
    await fetcher<ReceivedChart[]>(url, {
      method: 'GET',
    })
  ).toJSON();
};
export const getDaysPayableOutstanding = async (
  params: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.overview.dpo,
    params,
  ).build();

  return (
    await fetcher<ReceivedChart[]>(url, {
      method: 'GET',
    })
  ).toJSON();
};
