'use server';

import { Nomenclator } from '@/server/types/nomenclator';
import { fetcher } from '../../core/lib/result-fetcher';
import { ComboBoxOption } from '../types/combo-box';
import { BACKEND_ROUTES } from './endpoints';

export const getAdminCompanyNomenclator = async (): Promise<{
  items: Nomenclator[];
}> => {
  const response = await fetcher<{
    items: Nomenclator[];
  }>(`/admin/nomenclatures/companies`);
  if (!response.data || !response.success) {
    return { items: [] };
  }

  return response.data;
};

export const getProductionsNomenclator = async (): Promise<
  ComboBoxOption[]
> => {
  const res = await fetcher<ComboBoxOption[]>(
    BACKEND_ROUTES.dashboard.filters.productions,
  );
  if (!res.data || !res.success) return [];
  return res.data;
};

export const getAdminAdvertisersNomenclator = async (): Promise<
  ComboBoxOption[]
> => {
  const response = await fetcher<ComboBoxOption[]>(
    BACKEND_ROUTES.dashboard.filters.advertiser,
  );

  if (!response.data || !response.success) {
    return [];
  }

  return response.data;
};

export const getBookingPayerNomenclator = async (): Promise<{
  items: Nomenclator[];
}> => {
  try {
    return await Promise.resolve({ items: [] });
    // const response = await fetchWithAuth(`/admin/nomenclatures/advertisers`);
    // if (!response.ok) {
    //   throw new Error('Error fetching nomenclature advertisers');
    // }
    // return await response.json();
  } catch (e) {
    return Promise.resolve({ items: [] });
  }
};

export const getPayersNomenclator = async (): Promise<ComboBoxOption[]> => {
  const res = await fetcher<ComboBoxOption[]>(
    BACKEND_ROUTES.dashboard.filters.payers,
  );
  if (!res.success || !res.data) return [];
  return res.data;
};
