'use server';

import { parsePathname } from '@/core/lib/utils';
import { parseUtcDate } from '../../core/lib/date';
import { QueryParamsURLFactory } from '../../core/lib/request';
import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import {
  BookingFilesProcessingStatus,
  BookingStats,
  Draft,
  DraftDetails,
  Flight,
  InsertionOrder,
  Invoice,
  PendingDraftsAmount,
  ReviewDraftDto,
} from '../types/booking';
import { ReceivedChart } from '../types/chart';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import { getInvoicesMocked } from './__mock/booking';
import { BACKEND_ROUTES } from './endpoints';

export const getInsertionOrders = async (
  params: SearchParams,
): Promise<PaginatedData<InsertionOrder>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.io.list,
    params,
  ).build();
  const response = await fetcher<PaginatedData<InsertionOrder>>(url, {
    next: { tags: ['insertion-orders'] },
  });

  if (!response.success || !response.data) {
    return Promise.resolve({
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    });
  }
  return response.data;
};

export const getDrafts = async (
  params: SearchParams,
): Promise<PaginatedData<Draft>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.drafts.list,
    params,
  ).build();

  const response = await fetcher<PaginatedData<Draft>>(url, {
    next: { tags: ['drafts'] },
  });

  if (!response.success || !response.data) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return response.data;
};

export const getDraftDetails = async (id: string): Promise<DraftDetails> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.drafts.details.replace(':id', id),
  ).build();

  const emptyData: DraftDetails = {
    file: '',
    extracted_data: {
      payer_id: 0,
      payer_suggested: '',
      net_total_io_cost: 0,
      total_io_impressions: 0,
      gross_total_io_cost: 0,
      net_total_io_cost_currency: 0,
      gross_total_io_cost_currency: 0,
      signed_at: '',
    },
    flights: [],
    id: 0,
    status: 'uploaded',
  };

  const response = await fetcher<DraftDetails>(url);

  if (!response.data || !response.success) {
    return emptyData;
  }
  const data = response.data;
  try {
    const updatedData: DraftDetails = {
      ...data,
      extracted_data: {
        ...data.extracted_data,
        payer_id:
          data.extracted_data.payer_id ?? data.extracted_data.payer_suggested,
        signed_at: data.extracted_data.signed_at
          ? parseUtcDate(data.extracted_data.signed_at)
          : '',
      },
      flights: data.flights.map((flight) => ({
        ...flight,
        production_id: flight.production_id ?? flight.production_suggested,
      })),
    };
    return updatedData;
  } catch (error) {
    console.log('Error parsing draft details', error);
    return emptyData;
  }
};

export const getFlights = async (
  params: SearchParams,
): Promise<PaginatedData<Flight>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.flights.list,
    params,
  ).build();
  const response = await fetcher<PaginatedData<Flight>>(url, {
    next: { tags: ['flights'] },
  });

  if (!response.data || !response.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }

  return response.data;
};

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    await new Promise((res) => setTimeout(res, 2000));
    return Promise.resolve(getInvoicesMocked());
  } catch (e) {
    console.log(e);
    return Promise.resolve(getInvoicesMocked());
  }
};

export const createInsertionOrder = async (
  form: FormData,
): Promise<ResultObject<number | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.io.create,
  ).build();

  return (
    await fetcher<number>(url, {
      body: form,
      method: 'POST',
    })
  ).toJSON();
};

export const getBookingFilesProcessingStatus = async (): Promise<
  ResultObject<BookingFilesProcessingStatus | null>
> => {
  const url = BACKEND_ROUTES.dashboard.booking.files.processingStatus;
  return (
    await fetcher<BookingFilesProcessingStatus>(url, {
      method: 'GET',
    })
  ).toJSON();
};

export const reviewDraft = async (
  draftId: string,
  data: ReviewDraftDto,
): Promise<ResultObject<void>> => {
  const url = BACKEND_ROUTES.dashboard.booking.drafts.review.replace(
    ':id',
    draftId,
  );
  return (
    await fetcher<void>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
  ).toJSON();
};

export const getPendingDraftsAmount = async (): Promise<
  ResultObject<PendingDraftsAmount | null>
> => {
  try {
    const url = BACKEND_ROUTES.dashboard.booking.drafts.pending;

    return (
      await fetcher<PendingDraftsAmount>(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
        cache: 'no-cache',
      })
    ).toJSON();
  } catch (e) {
    console.log(e);
    throw new Error('Error getting pending drafts');
  }
};

/*
 *Booking overview
 */

export const getBookingStats = async (
  searchParams: SearchParams,
): Promise<ResultObject<BookingStats | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.overview.stats,
    searchParams,
  ).build();

  return (await fetcher<BookingStats>(url)).toJSON();
};

export const deleteDraft = async (id: string): Promise<ResultObject<null>> => {
  const url = new QueryParamsURLFactory(
    parsePathname(BACKEND_ROUTES.dashboard.booking.drafts.details, { id }),
  ).build();

  return (await fetcher<null>(url, { method: 'DELETE' })).toJSON();
};

export const getBookingValues = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.overview.booking_values,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
export const getBookingFulfillmentRate = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.overview.fulfillment_rate,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};

export const getBookingPayerConcentration = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.overview.payer_concentration,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
export const getBookingProductionsConcentration = async (
  searchParams: SearchParams,
): Promise<ResultObject<ReceivedChart[] | null>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.booking.overview.production_concentration,
    searchParams,
  ).build();

  return (await fetcher<ReceivedChart[]>(url)).toJSON();
};
