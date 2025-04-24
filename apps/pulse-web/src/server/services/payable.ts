'use server';

import { QueryParamsURLFactory } from '../../core/lib/request';
import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { ReceivedChart, ReceivedOverdueChart } from '../types/chart';
import { Expenses } from '../types/expenses';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import {
  PayableBills,
  PayableBillsRegisterPayment,
  PayableOverviewCharts,
  PayableOverviewStats,
  PayableProductionBill,
  PayableProductionDto,
  PayableProductionFlight,
  ProductionListDto,
  ProductionsOverviewStatsType,
} from '../types/payable';
import { BACKEND_ROUTES } from './endpoints';

export const getPayableProductions = async (
  params: SearchParams,
): Promise<PaginatedData<ProductionListDto>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.productions.list,
    params,
  ).build();

  const res = await fetcher<PaginatedData<ProductionListDto>>(url, {
    next: { tags: ['payable-productions'] },
  });
  if (!res.data || !res.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return res.data;
};

export const createPayableProduction = async (
  data: FormData,
): Promise<ResultObject<{ id: string } | null>> => {
  const url = BACKEND_ROUTES.dashboard.payable.create_productions;
  return (
    await fetcher<{ id: string }>(url, {
      method: 'POST',
      body: data,
    })
  ).toJSON();
};

export const updatePayableProduction = async (
  data: FormData,
  id: string,
): Promise<ResultObject<void | null>> => {
  const url = BACKEND_ROUTES.dashboard.payable.update_production.replace(
    ':id',
    id,
  );
  return (
    await fetcher<void>(url, {
      method: 'PATCH',
      body: data,
    })
  ).toJSON();
};

export const getPayableProduction = async (
  id: string,
): Promise<ResultObject<PayableProductionDto | null>> => {
  const url = BACKEND_ROUTES.dashboard.payable.get_production.replace(
    ':id',
    id,
  );

  return (await fetcher<PayableProductionDto>(url)).toJSON();
};

export const deletePayableProduction = async (
  id: number,
): Promise<ResultObject<void | null>> => {
  return (
    await fetcher<void>(
      BACKEND_ROUTES.dashboard.payable.delete_production.replace(
        ':id',
        id.toString(),
      ),
      {
        method: 'DELETE',
      },
    )
  ).toJSON();
};

/*
 * Bills list
 */

export const getPayableBillsList = async (
  params: SearchParams,
): Promise<PaginatedData<PayableBills>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.list_bills,
    params,
  ).build();

  const res = (
    await fetcher<PaginatedData<PayableBills>>(url, {
      method: 'GET',
      next: { tags: ['payable-bills'] },
    })
  ).toJSON();

  if (!res.data || !res.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return res.data;
};

/*
 * Register bills payment
 */

export const registerBillPayment = async (
  bill_id: string,
  data: PayableBillsRegisterPayment,
): Promise<ResultObject<unknown>> => {
  const url = BACKEND_ROUTES.dashboard.payable.register_payment.replace(
    ':id',
    bill_id,
  );

  return (
    await fetcher<void>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).toJSON();
};

export const getProductionBills = async (
  params: SearchParams,
): Promise<ResultObject<PaginatedData<PayableProductionBill> | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.production_bills,
    params,
  ).build();

  return (
    await fetcher<PaginatedData<PayableProductionBill>>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['payable-production-bills'],
      },
    })
  ).toJSON();
};

export const getProductionExpenses = async (
  searchParams?: SearchParams,
): Promise<ResultObject<PaginatedData<Expenses> | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.production_expenses,
    searchParams,
  ).build();

  return (
    await fetcher<PaginatedData<Expenses>>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).toJSON();
};

export const getProductionFlights = async (
  searchParams: SearchParams = {},
): Promise<ResultObject<PaginatedData<PayableProductionFlight> | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.production_flights,
    searchParams,
  ).build();

  return (
    await fetcher<PaginatedData<PayableProductionFlight>>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['payable-production-flights'],
      },
    })
  ).toJSON();
};

/*
 * Get the Payable overview stats
 */

export const getPayableOverviewStats = async (
  params: SearchParams,
): Promise<ResultObject<PayableOverviewStats | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.overview.stats,
    params,
  ).build();

  const response = await fetcher<PayableOverviewStats>(url);

  if (!response.data || !response.success) {
    return Promise.resolve({
      success: true,
      error: null,
      data: {
        on_time_payment_rate: 0,
        production_payment_on_uncollected_invoices: 0,
        total_outstanding: 0,
        total_overdue: 0,
      },
    });
  }

  return response.toJSON();
};

export const getPayableOverviewChartsData = async (
  params: SearchParams,
  chartType: PayableOverviewCharts,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.overview.charts,
    params,
  )
    .build()
    .replace(':type', chartType);

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
export const getPayableOverviewStackData = async (
  params: SearchParams,
  chartType: PayableOverviewCharts,
): Promise<ResultObject<ReceivedOverdueChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.overview.stack_chart,
    params,
  )
    .build()
    .replace(':type', chartType);

  return (await fetcher<ReceivedOverdueChart[]>(url)).toJSON();
};

export const getPayableProductionDetailStats = async (
  params: SearchParams,
): Promise<ResultObject<ProductionsOverviewStatsType | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.overview.production_details.stats,
    params,
  ).build();

  return (await fetcher<ProductionsOverviewStatsType>(url)).toJSON();
};

export const getProductionsDetailsCharts = async (
  params: SearchParams,
  chartType: PayableOverviewCharts,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payable.overview.production_details.charts,
    params,
  )
    .build()
    .replace(':type', chartType);

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
