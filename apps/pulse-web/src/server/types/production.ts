import { PaginatedData } from './pagination';

/**
 * Represents the production dashboard summary
 */
export type ProductionDashboardSummary = {
  total_outstanding_receivables: number;
  total_currently_advanced: number;
  total_available_to_advance: number;
  estimated_cost: number;
  time_to_fund: number;
};

/**
 * Represents a financial entire
 */
export type FinancialEntire = {
  month: Date;
  revenue: number;
  expenses_recouped: number;
  net_revenue: number;
  unpaid_balance: number;
  advanced: number;
  available_to_advance: number;
  estimated_fee: number;
};

/**
 * Represents the list of financial entries for the production
 */
export type AdminDashboardInvoicesData = {
  total_revenue: number;
  total_expenses_recouped: number;
  total_net_revenue: number;
  total_unpaid_balance: number;
  total_advanced: number;
  total_available_to_advance: number;
  total_Estimated_fee: number;
} & PaginatedData<FinancialEntire>;

export type ProductionDetails = {
  advance_rate: number;
  factoring_fee: number;
  interest_rate: number;
  available_to_advance_immediately: number;
  total_cost_to_advance: number;
  balance_minus_fee: number;
};

//-------

export type RequestAdvanceCalculation = {
  estimated_cost: number;
};
