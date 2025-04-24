'use server';

import { fetcher } from '../../core/lib/result-fetcher';
import {
  AdminDashboardCompaniesData,
  AdminDashboardInvoicesData,
  AdminDashboardSummary,
} from '../types/admin';
import { SearchParams } from '../types/params';

export const getAdminInvoices = async (
  params: SearchParams,
): Promise<AdminDashboardInvoicesData> => {
  const response = await fetcher<AdminDashboardInvoicesData>(
    `/admin/invoices?${params.toString()}`,
    {
      next: { tags: ['admin-invoices'] },
    },
  );

  if (!response.data || !response.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 10, total: 0 },
      total_balance: 0,
      total_advanced_amount: 0,
    };
  }

  return response.data;
};

export const getAdminDashboardSummary =
  async (): Promise<AdminDashboardSummary> => {
    const response = await fetcher<AdminDashboardSummary>('/admin/summary');
    if (!response.data || !response.success) {
      return {
        total_accounts_receivable_approved: 0,
        total_accounts_receivable_waiting_approved: 0,
        total_advances_outstanding: 0,
        additional_available_to_advance: 0,
      };
    }

    return response.data;
  };

export const getAdminCompanies = async (
  params: SearchParams,
): Promise<AdminDashboardCompaniesData> => {
  const response = await fetcher<AdminDashboardCompaniesData>(
    `/admin/companies?${params.toString()}`,
  );

  if (!response.data || !response.success) {
    return {
      items: [],
      pagination: { page: 1, per_page: 10, total: 0 },
    };
  }

  return response.data;
};

export const setAdminInvoiceApprove = async (ids: string[]): Promise<void> => {
  const res = await fetcher<void>(`/admin/invoices/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ids),
  });

  if (res.data && res.success) {
    return res.data;
  }
};

export const setAdminInvoicesPaid = async (ids: string[]): Promise<void> => {
  const res = await fetcher<void>(`/admin/invoices/paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ids),
  });
  if (res.data && res.success) {
    return res.data;
  }
};
