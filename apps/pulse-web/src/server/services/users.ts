'use server';

import { QueryParamsURLFactory } from '@/core/lib/request';
import { fetcher } from '@/core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { PaginatedData } from '../types/pagination';
import { SearchParams } from '../types/params';
import { User, UserDTO } from '../types/users';
import { BACKEND_ROUTES } from './endpoints';

export const getUsers = async (
  params: SearchParams,
): Promise<PaginatedData<User>> => {
  const url = new QueryParamsURLFactory(
    BACKEND_ROUTES.dashboard.users.list,
    params,
  ).build();
  const response = await fetcher<PaginatedData<User>>(url, {
    next: { tags: ['users'] },
  });

  if (!response.success || !response.data) {
    return {
      items: [],
      pagination: { page: 1, per_page: 10, total: 0 },
    };
  }

  return response.data;
};

export const getUser = async (
  id: string,
): Promise<ResultObject<User | null>> => {
  const url = BACKEND_ROUTES.dashboard.users.by_id.replace(':id', id);
  return (
    await fetcher<User>(url, {
      method: 'GET',
    })
  ).toJSON();
};

export const createUser = async (
  data: UserDTO,
): Promise<ResultObject<{ id: string } | null>> => {
  const url = BACKEND_ROUTES.dashboard.users.create;

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

export const updateUser = async (
  id: string,
  data: UserDTO,
): Promise<ResultObject<User | null>> => {
  const url = BACKEND_ROUTES.dashboard.users.update.replace(':id', id);
  return (
    await fetcher<User>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).toJSON();
};

export const deleteUser = async (
  id: string,
): Promise<ResultObject<{ id: string } | null>> => {
  const url = BACKEND_ROUTES.dashboard.users.delete.replace(':id', id);

  return (
    await fetcher<{ id: string }>(url, {
      method: 'DELETE',
    })
  ).toJSON();
};

export const resendEmail = async (
  id: string,
): Promise<ResultObject<void | null>> => {
  const url = BACKEND_ROUTES.dashboard.users.resend.replace(':id', id);

  return (
    await fetcher<void>(url, {
      method: 'POST',
    })
  ).toJSON();
};
