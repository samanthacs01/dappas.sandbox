'use server';

import { fetcher } from '../../core/lib/result-fetcher';
import { ResultObject } from '../exceptions/result';
import { PayableProductionDto } from '../types/payable';
import { BACKEND_ROUTES } from './endpoints';

export const getAuthenticatedProduction = async (): Promise<
  ResultObject<PayableProductionDto | null>
> => {
  const url = BACKEND_ROUTES.dashboard.payable.update_production;
  return (
    await fetcher<PayableProductionDto>(url, {
      method: 'GET',
    })
  ).toJSON();
};
