import { AdminDashboardSummary, AdminInvoices } from '../types/admin';
import {
  invoices,
  adminDashboardSummary,
} from '@/server/services/__mock/admin';
import { PaginatedData } from '../types/pagination';

export async function getAdminInvoices(): Promise<
  PaginatedData<AdminInvoices>
> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Promise.resolve({
      items: invoices,
      pagination: {
        page: 1,
        per_page: 15,
        total: 10,
      },
    });
  } catch (e) {
    console.error(e);
    return { items: [], pagination: { page: 0, per_page: 0, total: 0 } };
  }
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Promise.resolve(adminDashboardSummary);
  } catch (e) {
    console.error(e);
    return {
      additional_available_to_advance: 0,
      total_accounts_receivable_approved: 0,
      total_accounts_receivable_waiting_approved: 0,
      total_advances_outstanding: 0,
    };
  }
}
