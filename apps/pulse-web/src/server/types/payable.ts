import { UploadFile } from '@/core/components/common/upload/types';

export type PaymentType = 'billing' | 'collection';
export type ExpenseRecoupmentType = 'before' | 'after';

export type CreateProductionDto = {
  entity_name: string;
  entity_address: string;
  contact_name: string;
  contact_phone_number: string;
  contact_email: string;
  production_split: number;
  production_billing_type: PaymentType;
  net_payment_terms: number;
  production_expense_recoupment_type: ExpenseRecoupmentType;
  contract_file: File | UploadFile;
};

export type PayableProductionDto = CreateProductionDto & {
  id: number;
};

export type ProductionListDto = {
  id: number;
  entity_name: string;
  balance: number;
  dpo: number;
  payment_type: PaymentType;
};

export type PayableBills = {
  id: string;
  production: string;
  payment_type: string;
  flight_month: string | null;
  amount: number;
  balance: number;
  due_date: string;
  status: string;
  identifier: string;
};

export type PayableBillsRegisterPayment = {
  amount: number;
};

export type PayableProductionBillStatus =
  | 'partially_paid'
  | 'paid'
  | 'pending_payment';

export type PayableProductionBill = {
  id: number;
  month: number;
  revenue: number;
  expenses: number;
  net_due: number;
  balance: number;
  due_date: Date;
  status: PayableProductionBillStatus;
  billId: string;
  production: string;
};

export type PayableProductionFlight = {
  id: number;
  flight: string;
  payer: string;
  revenue: number;
  due_date: Date;
  status: PayableProductionBillStatus;
  production: string;
  billId: string;
  balance: number;
  amount: number;
};

export type PayableProductionExpense = {
  date: string;
  total_deduction: string;
};

/*
 * Represent the payable overview stats
 */

export type PayableOverviewStats = {
  total_outstanding: number;
  total_overdue: number;
  on_time_payment_rate: number;
  production_payment_on_uncollected_invoices: number;
};

export type PayableOverviewCharts =
  | 'payables_outstanding_productions'
  | 'payables_outstanding_dates'
  | 'paid_uncollected_payment_productions'
  | 'paid_uncollected_payment_dates'
  | 'payables_on_time_rate'
  | 'payables_overdue_bills'
  | 'production_details_bookings'
  | 'production_details_net_revenues';

export type ProductionsOverviewStatsType = {
  average_monthly_revenue: number;
  monthly_variance: number;
  net_revenue: number;
  next_payment_amount: number;
  next_payment_date: string;
  total_booked: number;
};
