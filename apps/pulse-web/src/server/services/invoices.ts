'use server';

import { QueryParamsURLFactory } from '../../core/lib/request';
import { fetcher } from '../../core/lib/result-fetcher';
import { Result, ResultObject } from '../exceptions/result';
import { Invoice } from '../types/booking';
import { SearchParams } from '../types/params';
import { BACKEND_ROUTES } from './endpoints';

export const generateInvoices = async (
  flights: number[],
): Promise<ResultObject<Invoice[] | null>> => {
  const url = BACKEND_ROUTES.dashboard.invoices.generate;
  return (
    await fetcher<Invoice[]>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flights }),
    })
  ).toJSON();
};

export const acceptInvoices = async (
  ids: number[],
): Promise<ResultObject<void | null>> => {
  const url = BACKEND_ROUTES.dashboard.invoices.accept;
  return (
    await fetcher<void>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })
  ).toJSON();
};

export const exportReceivablesInvoices = async (
  params: SearchParams,
): Promise<Result<Blob | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.invoices.export,
    params,
  ).build();

  const responseParser = async (response: Response) => await response.blob();

  return await fetcher<Blob>(url, {}, responseParser);
};
