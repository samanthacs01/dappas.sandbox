'use server';

import { Expense } from '@/server/types/expenses';
import { QueryParamsURLFactory } from '../../core/lib/request';
import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { Expenses } from '../types/expenses';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import { BACKEND_ROUTES } from './endpoints';

export const getExpenses = async (
  params: SearchParams,
): Promise<PaginatedData<Expenses>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.expenses.list,
    params,
  ).build();
  const res = await fetcher<PaginatedData<Expenses>>(url, {
    next: {
      tags: ['expenses-list'],
    },
  });
  if (!res.success || !res.data) {
    return {
      items: [],
      pagination: { page: 1, per_page: 15, total: 10 },
    };
  }
  return res.data;
};

export const createNewExpense = async (
  data: FormData,
): Promise<ResultObject<{ id: number } | null>> => {
  const url = BACKEND_ROUTES.dashboard.expenses.create;
  return (
    await fetcher<{ id: number }>(url, {
      method: 'POST',
      body: data,
    })
  ).toJSON();
};

export const deleteExpense = async (
  id: string,
): Promise<ResultObject<void | null>> => {
  return (
    await fetcher<void>(
      BACKEND_ROUTES.dashboard.expenses.delete.replace(':id', id),
      {
        method: 'DELETE',
      },
    )
  ).toJSON();
};

export const getExpense = async (
  id: string,
): Promise<ResultObject<Expense | null>> => {
  const url = BACKEND_ROUTES.dashboard.expenses.by_id.replace(':id', id);
  return (
    await fetcher<Expense>(url, {
      method: 'GET',
    })
  ).toJSON();
};

export const updateExpense = async (
  data: FormData,
  id: string,
): Promise<ResultObject<{ id: number } | null>> => {
  const url = BACKEND_ROUTES.dashboard.expenses.update.replace(':id', id);
  return (
    await fetcher<{ id: number }>(url, {
      method: 'PATCH',
      body: data,
    })
  ).toJSON();
};
