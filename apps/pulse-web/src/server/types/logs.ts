export type EntityType =
  | 'productions'
  | 'users'
  | 'io_drafts'
  | 'flights'
  | 'payers'
  | 'payables'
  | 'expenses'
  | 'io_draft_flights'
  | 'invoices'
  | 'insertion_orders'
  | 'bills'
  | 'expense_docs'
  | 'invoice_payments';

export const entityName: Record<EntityType, string> = {
  productions: 'Productions',
  users: 'Users',
  io_drafts: 'IO Drafts',
  flights: 'Flights',
  payers: 'Payers',
  payables: 'Payables',
  expenses: 'Expenses',
  io_draft_flights: 'IO Drafts Flights',
  invoices: 'Invoices',
  insertion_orders: 'Insertion Orders',
  bills: 'Bills',
  expense_docs: 'Expense Docs',
  invoice_payments: 'Invoice Payments',
};

export const actionsName: Record<string, string> = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  INSERT: 'Insert',
};

export type ActivityLogs = {
  id: number;
  action_at: string;
  actor: string;
  entity: EntityType;
  entity_id: string;
  action: string;
  data: LogData;
};

export type LogData = {
  address: string;
  change_by: string;
  contact_email: string;
  contact_name: string;
  contact_phone_number: string;
  contract_file_path: string;
  created_at: string;
  deleted_at: string;
  entity_name: string;
  id: number;
  identifier: string;
  net_payment_terms: number;
  production_billing_type: string;
  production_expense_discount_type: string;
  production_split: number;
  updated_at: string;
};
