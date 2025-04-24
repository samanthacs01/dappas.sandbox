'use server';

import { authOptions } from '@/core/lib/auth';
import { captureException } from '@sentry/nextjs';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Result } from '../../server/exceptions/result';
import {
  HttpServerError,
  HttpServerErrorType,
} from '../../server/exceptions/server-errors';

export const fetcher = async <TData>(
  input: RequestInfo | URL,
  init?: RequestInit,
  responseParser?: (response: Response) => Promise<TData>,
): Promise<Result<TData | null>> => {
  const _fetch = async () => {
    const newInit = { ...init };
    newInit.headers = newInit.headers
      ? new Headers(newInit.headers)
      : new Headers();

    // Add Authorization header
    const session = await getServerSession(authOptions);

    if (session?.user.token) {
      newInit.headers.append('Authorization', `Bearer ${session.user.token}`);
    }

    try {
      const response = await fetch(`${input}`, newInit);

      if (response.status === 401) {
        return Result.Fail<HttpServerErrorType>(
          new HttpServerError(
            'Unauthorized',
            '',
            401,
            'Unauthorized',
            'HttpServerError',
          ).toJSON(),
        );
      }
      if (response.status === 204) {
        return Result.Success(null);
      }
      let data;

      if (responseParser) {
        data = await responseParser(response);
      } else {
        data = await response.json();
      }

      if (!response.ok) {
        // Backend response error logs
        console.log(response);
        return Result.Fail<HttpServerError>(data as HttpServerError);
      }

      return Result.Success(data);
    } catch (error) {
      // Capture error to Sentry service
      captureException(error, { level: 'log', tags: { backend: true } });

      return Result.Fail<HttpServerErrorType>(
        new HttpServerError(
          (error as Error).message,
          '',
          500,
          'Internal Server Error',
          'HttpServerError',
        ).toJSON(),
      );
    }
  };
  const response = await _fetch();
  if (!response.success && response.error?.status === 401) {
    redirect('/login');
  }
  return response;
};
