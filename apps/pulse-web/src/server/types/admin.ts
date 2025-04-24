import { PaginatedData, PaginationFilter } from './pagination';

/**
 * Represents the admin dashboard summary
 */
export type AdminDashboardSummary = {
  total_accounts_receivable_approved: number;
  total_accounts_receivable_waiting_approved: number;
  total_advances_outstanding: number;
  additional_available_to_advance: number;
};

/**
 * Represents the invoice status
 */
export type AdminInvoicesStatus = 'UPLOADED' | 'APPROVED' | 'PAID';

/**
 * Represents a invoice in the admin dashboard
 */
export type AdminInvoices = {
  id: number;
  advertiser: string;
  company: string;
  production: string;
  balance: number;
  status: AdminInvoicesStatus;
  advance_amount: number;
};

/**
 * Represents the list of invoices in the admin dashboard
 */
export type AdminDashboardInvoicesData = {
  total_balance: number;
  total_advanced_amount: number;
} & PaginatedData<AdminInvoices>;

/**
 * Represents a company in the admin dashboard
 */
export type AdminCompany = {
  id: number;
  company: string;
  advanced: number;
  waiting_approval: number;
  outstanding: number;
  additional_advance_available: number;
};

/**
 * Represents the list of companies in the admin dashboard
 */
export type AdminDashboardCompaniesData = {} & PaginatedData<AdminCompany>;


/**
 * Represents the data transfer object for an admin company(New|Update)
 */
export type AdminCompanyDTO = {
  company_name: string;
  email: string;
  physical_address: string;
  credit_limit: number;
  advance_rate: number;
  factor_fee: number;
  interest_rate: number;
  average_days_to_collect: number;
};

export type AdminInvoiceFilters = {
  companies?: string[];
  production?: string[];
  advertisers?: string[];
  status?: string[];
  start_date?: string;
  end_date?: string;
} & PaginationFilter
