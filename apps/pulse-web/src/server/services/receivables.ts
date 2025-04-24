'use server';

import { parsePathname } from '@/core/lib/utils';
import { fetchWithAuth } from '../../core/lib/fetcher';
import { QueryParamsURLFactory } from '../../core/lib/request';
import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import {
  CollectionRateChart,
  NewReceivablePayer,
  ReceivableOverviewStats,
  ReceivablePayers,
  ReceivablesInvoices,
} from '../types/receivables';
import {
  _getReceivableCollectionRate,
  _getReceivablesOverdueInvoice,
  _getReceivablesTotalOutstanding,
  generateRandomInvoice,
} from './__mock/receivables';
import { BACKEND_ROUTES } from './endpoints';
import { ReceivedChart, ReceivedOverdueChart } from '../types/chart';

export const getReceivablesInvoices = async (
  params: SearchParams,
): Promise<PaginatedData<ReceivablesInvoices>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.invoices.root,
    params,
  ).build();
  const response = await fetcher<PaginatedData<ReceivablesInvoices>>(url, {
    next: { tags: ['invoices'] },
  });

  if (!response.data || !response.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return response.data;
};

export const getReceivableInvoice = async (
  id: string,
): Promise<ReceivablesInvoices | null> => {
  try {
    return Promise.resolve(generateRandomInvoice());
  } catch (e) {
    console.log(e);
    return Promise.resolve(null);
  }
};
export const getReceivablesPayers = async (
  params: SearchParams,
): Promise<PaginatedData<ReceivablePayers>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.payers.list,
    params,
  ).build();

  const res = await fetcher<PaginatedData<ReceivablePayers>>(url, {
    method: 'GET',
    next: { tags: ['receivables-payers'] },
  });

  if (!res.success || !res.data) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return res.data;
};

//Delete receivable payer

export const deleteReceivablePayer = async (
  id: string,
): Promise<ResultObject<void | null>> => {
  return (
    await fetcher<void>(
      BACKEND_ROUTES.dashboard.payers.delete.replace(':id', id),
      {
        method: 'DELETE',
      },
    )
  ).toJSON();
};

//Create new receivable payer

export const createReceivablePayer = async (
  data: NewReceivablePayer,
): Promise<ResultObject<{ id: string } | null>> => {
  const url = BACKEND_ROUTES.dashboard.payers.create;
  return (
    await fetcher<{ id: string }>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).toJSON();
};

export const getReceivablePayerDetails = async (
  id: string,
): Promise<ReceivablePayers> => {
  try {
    const url = BACKEND_ROUTES.dashboard.payers.get.replace(':id', id);
    const res = await fetchWithAuth(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error getting receivable payer');
    }
    return await res.json();
  } catch (e) {
    console.error(e);
    throw new Error('Error getting receivable payer');
  }
};

export const editReceivablePayer = async (
  data: ReceivablePayers,
): Promise<ResultObject<{ id: string } | null>> => {
  const url = BACKEND_ROUTES.dashboard.payers.get.replace(
    ':id',
    data.id.toString(),
  );
  return (
    await fetcher<{ id: string }>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).toJSON();
};

export const invoicesPayment = async (id: string, amount: number) => {
  const url = parsePathname(BACKEND_ROUTES.dashboard.invoices.payment, {
    id,
  });
  return (
    await fetcher<null>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })
  ).toJSON();
};

/*
 * Receivable overview
 */

export const getReceivableOverviewStats = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivableOverviewStats | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.overview_stats,
    searchParams,
  ).build();
  return (await fetcher<ReceivableOverviewStats>(url)).toJSON();
};

export const getReceivablesTotalOutstanding = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.total_outstanding,
    searchParams,
  ).build();
  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};

export const getReceivablesOverdueInvoice = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedOverdueChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.overdue,
    searchParams,
  ).build();

  return (await fetcher<ReceivedOverdueChart[]>(url)).toJSON();
};
export const getReceivableCollectionOverall = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.collection_overall,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};

export const getReceivableCollectionWithPaymentTerms = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.collection_with_payment_terms,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};

export const getReceivableCustomerConcentration = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.receivables.customer_concentration,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
