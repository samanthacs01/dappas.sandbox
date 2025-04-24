import { ReceivedChart } from './chart';

/**
 * Represents the Receivables Invoice Filters status
 */
export type ReceivablesInvoiceStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'partial_paid';

/*
 * Represents the Receivables Invoice in receivables dashboard
 */

export type ReceivablesInvoices = {
  id: number;
  identifier: string;
  payer: string;
  productions: string[];
  bills: string[];
  amount_to_pay: number;
  balance: number;
  payment_terms: number;
  invoice_date: string;
  due_date: string;
  status: ReceivablesInvoiceStatus;
};

/**
 * Represents the Receivables Invoice Payment
 */
export type ReceivableInvoicePayment = {
  payment_amount: number;
};

/*
 * Represents the Receivables Payers in receivables dashboard
 */

export type ReceivablePayers = {
  id: number;
  entity_name: string;
  entity_address: string;
  contact_name: string;
  contact_phone_number: string;
  contact_email: string;
  payment_terms: number;
};

/*
 * Represents the new receivable payer
 */

export type NewReceivablePayer = Omit<ReceivablePayers, 'id'>;

/*
 * Represent the receivable overview stats
 */

export type ReceivableOverviewStats = {
  collection_rate: number;
  customer_concentration: number;
  total_outstanding: number;
  total_overdue: number;
  collection_with_payment_terms: number;
};

export type CollectionRateChart = {
  overall: ReceivedChart[];
  payment_terms: ReceivedChart[];
};
