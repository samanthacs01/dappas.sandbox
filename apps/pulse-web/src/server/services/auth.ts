'use server';

import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import {
  LoginResponse,
  RecoverPassword,
  SetPasswordDTO,
  UserLogin,
} from '../types/login';
import { BACKEND_ROUTES } from './endpoints';

export const requestRecoverPassword = async ({
  email,
}: RecoverPassword): Promise<ResultObject<void>> => {
  return (
    await fetcher<void>(BACKEND_ROUTES.security.recover_password, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
  ).toJSON();
};

export const setNewPassword = async ({
  password,
  token,
}: SetPasswordDTO): Promise<ResultObject<LoginResponse | null>> => {
  return (
    await fetcher<LoginResponse>(BACKEND_ROUTES.security.change_password, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
  ).toJSON();
};

export const securityAuth = async (
  data: UserLogin,
): Promise<ResultObject<LoginResponse | null>> => {
  const url = BACKEND_ROUTES.security.auth;
  return (
    await fetcher<LoginResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  ).toJSON();
};
