export type DataSeries = {
  name: string;
  value?: number;
  fill?: string;
  color?: string;
  details?: string;
} & Record<string, unknown>;

export type OverviewDashboardData = {
  total: number;
  serie: Array<DataSeries>;
};

export type OverviewGeneralDashboardData = {
  revenue: OverviewDashboardData;
  gross_margin: OverviewDashboardData;
  days_sales_outstanding: OverviewDashboardData;
  days_payable_outstanding: OverviewDashboardData;
  aging_report: OverviewDashboardData;
};

export type OverviewBookingDashboardData = {
  booking_value: OverviewDashboardData;
  booking_fullfilment_rate: OverviewDashboardData;
  customer_concentration: OverviewDashboardData;
  production_concentration: OverviewDashboardData;
};

export type OverviewReceivablesDashboardData = {
  total_receivables_outstanding: OverviewDashboardData;
  aging_report: OverviewDashboardData;
  collection_rate: OverviewDashboardData;
  bad_debt_ratio: OverviewDashboardData;
};

export type OverviewPayablessDashboardData = {
  total_payables_outstanding: OverviewDashboardData;
  production_aging_breakdown: OverviewDashboardData;
  on_time_payment_rate: OverviewDashboardData;
  prod_payment_on_uncollected_invoices: OverviewDashboardData;
};

export type GeneralOverviewStatsDTO = {
  total_revenue: number;
  gross_margin: number;
  dso: number;
  dpo: number;
};

export type GeneralOverview = 'total_revenue' | 'gross_margin' | 'dso' | 'dpo';
