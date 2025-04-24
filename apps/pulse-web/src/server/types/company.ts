import { PaginatedData } from './pagination';
/**
 * Represents the company dashboard summary
 */
export type CompanyDashboardSummary = {
  total_receivables: number;
  total_company_portion_receivables: number;
  total_advanced: number;
  total_available_advance: number;
};

/**
 * Represents the invoice status
 */
export type CompanyInvoicesStatus = 'UPLOADED' | 'APPROVED' | 'PAID';

/**
 * Represents a company invoice
 */
export type CompanyInvoices = {
  id: number;
  advertiser: string;
  production: string;
  balance: number;
  company_advance_amount: number;
  status: CompanyInvoicesStatus;
};

/**
 * Represents the list of invoices in the company dashboard
 */
export type CompanyDashboardInvoicesData = {
  total_advanced_amount: number;
  total_balance: number;
} & PaginatedData<CompanyInvoices>;

/**
 * Represents the data transfer object for an company invoice(New|Update)
 */
export type CompanyInvoiceDTO = {
  advertiser: string;
  production: string;
  invoice_date: string;
  invoice_amount: number;
  advance_rate: number;
  upload_insertion_order: File;
  upload_invoice: File;
  upload_ad_copy: File;
};

/**
 * Represents a company invoice
 */
export type CompanyProductions = {
  id: number;
  name: string;
  representative_name: string;
  representative_email: number;
  representative_address: number;
};

/**
 * Represents the list of productions in the company dashboard
 */
export type CompanyDashboardProductionsData =
  {} & PaginatedData<CompanyProductions>;

/**
 * Represents the data transfer object for an company productions(New|Update)
 */
export type CompanyProductionsDTO = {
  name: string;
  representative_name: string;
  representative_email: number;
  representative_address: number;
  recouped_expenses: number;
  production_split: number;
  company_split: number;
};

/**
 * Represents a company advertisers
 */
export type CompanyAdvertisers = {
  id: number;
  name: string;
  address: string;
  representative_email: number;
  payment_terms: number;
  current_ar_balance: number;
  current_ar_balance_per_day: number;
};

/**
 * Represents the list of advertisers in the company dashboard
 */
export type CompanyDashboardAdvertisersData =
  {} & PaginatedData<CompanyAdvertisers>;

/**
 * Represents the data transfer object for an company advertisers(New|Update)
 */
export type CompanyAdvertisersDTO = {
  name: string;
  address: string;
  representative_email: number;
  payment_terms: number;
};

export type CompanyInvoiceDraft = {
  invoice_id: string
  advertiser: string
  production: string
  invoice_date: string
  invoice_amount: number
  production_split: number
}
