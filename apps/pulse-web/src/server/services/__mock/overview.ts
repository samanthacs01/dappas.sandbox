import {
  OverviewBookingDashboardData,
  OverviewGeneralDashboardData,
  OverviewPayablessDashboardData,
  OverviewReceivablesDashboardData,
} from '@/server/types/overview';

const overviewGeneralDashboardData: OverviewGeneralDashboardData = {
  revenue: {
    total: 1500,
    serie: [
      { name: 'Jan', value: 150 },
      { name: 'Feb', value: 250 },
      { name: 'Mar', value: 350 },
      { name: 'Apr', value: 450 },
      { name: 'May', value: 300 },
    ],
  },
  gross_margin: {
    total: 50,
    serie: [
      { name: 'Jan', value: 120, fill: 'var(--color-Jan)' },
      { name: 'Feb', value: 220, fill: 'var(--color-Feb)' },
      { name: 'Mar', value: 320, fill: 'var(--color-Mar)' },
      { name: 'Apr', value: 420, fill: 'var(--color-Apr)' },
      { name: 'May', value: 320, fill: 'var(--color-May)' },
    ],
  },
  days_sales_outstanding: {
    total: 900,
    serie: [
      { name: 'Jan', value: 90 },
      { name: 'Feb', value: 360 },
      { name: 'Mar', value: 270 },
      { name: 'Apr', value: 20 },
      { name: 'May', value: 450 },
    ],
  },
  days_payable_outstanding: {
    total: 1100,
    serie: [
      { name: 'Jan', value: 110 },
      { name: 'Feb', value: 40 },
      { name: 'Mar', value: 330 },
      { name: 'Apr', value: 440 },
      { name: 'May', value: 320 },
    ],
  },
  aging_report: {
    total: 5000,
    serie: [
      { name: 'Jan', value: 110, fill: 'var(--color-Jan)' },
      { name: 'Feb', value: 40, fill: 'var(--color-May)' },
      { name: 'Mar', value: 330, fill: 'var(--color-Jan)' },
      { name: 'Apr', value: 440, fill: 'var(--color-May)' },
      { name: 'May', value: 320, fill: 'var(--color-Jan)' },
    ],
  },
};

const overviewBookingDashboardData: OverviewBookingDashboardData = {
  booking_value: {
    total: 1600,
    serie: [
      { name: 'Jan', value: 160 },
      { name: 'Feb', value: 260 },
      { name: 'Mar', value: 360 },
      { name: 'Apr', value: 460 },
      { name: 'May', value: 560 },
    ],
  },
  booking_fullfilment_rate: {
    total: 1300,
    serie: [
      { name: 'Jan', value: 130 },
      { name: 'Feb', value: 230 },
      { name: 'Mar', value: 330 },
      { name: 'Apr', value: 430 },
      { name: 'May', value: 530 },
    ],
  },
  customer_concentration: {
    total: 1400,
    serie: [
      { name: 'Jan', value: 140 },
      { name: 'Feb', value: 240 },
      { name: 'Mar', value: 340 },
      { name: 'Apr', value: 440 },
      { name: 'May', value: 540 },
    ],
  },
  production_concentration: {
    total: 1700,
    serie: [
      { name: 'Jan', value: 170 },
      { name: 'Feb', value: 270 },
      { name: 'Mar', value: 370 },
      { name: 'Apr', value: 470 },
      { name: 'May', value: 570 },
    ],
  },
};

const overviewReceivablesDashboardData: OverviewReceivablesDashboardData = {
  total_receivables_outstanding: {
    total: 1800,
    serie: [
      { name: 'Jan', value: 180 },
      { name: 'Feb', value: 280 },
      { name: 'Mar', value: 380 },
      { name: 'Apr', value: 480 },
      { name: 'May', value: 580 },
    ],
  },
  aging_report: {
    total: 1900,
    serie: [
      { name: 'Jan', value: 190 },
      { name: 'Feb', value: 290 },
      { name: 'Mar', value: 390 },
      { name: 'Apr', value: 490 },
      { name: 'May', value: 590 },
    ],
  },
  collection_rate: {
    total: 2000,
    serie: [
      { name: 'Jan', value: 200 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 400 },
      { name: 'Apr', value: 500 },
      { name: 'May', value: 600 },
    ],
  },
  bad_debt_ratio: {
    total: 2100,
    serie: [
      { name: 'Jan', value: 210 },
      { name: 'Feb', value: 310 },
      { name: 'Mar', value: 410 },
      { name: 'Apr', value: 510 },
      { name: 'May', value: 610 },
    ],
  },
};

const overviewPayablessDashboardData: OverviewPayablessDashboardData = {
  total_payables_outstanding: {
    total: 2200,
    serie: [
      { name: 'Jan', value: 220 },
      { name: 'Feb', value: 320 },
      { name: 'Mar', value: 420 },
      { name: 'Apr', value: 520 },
      { name: 'May', value: 620 },
    ],
  },
  production_aging_breakdown: {
    total: 2300,
    serie: [
      { name: 'Jan', value: 230 },
      { name: 'Feb', value: 330 },
      { name: 'Mar', value: 430 },
      { name: 'Apr', value: 530 },
      { name: 'May', value: 630 },
    ],
  },
  on_time_payment_rate: {
    total: 2400,
    serie: [
      { name: 'Jan', value: 240 },
      { name: 'Feb', value: 340 },
      { name: 'Mar', value: 440 },
      { name: 'Apr', value: 540 },
      { name: 'May', value: 640 },
    ],
  },
  prod_payment_on_uncollected_invoices: {
    total: 2500,
    serie: [
      { name: 'Jan', value: 250 },
      { name: 'Feb', value: 350 },
      { name: 'Mar', value: 450 },
      { name: 'Apr', value: 550 },
      { name: 'May', value: 650 },
    ],
  },
};

export const getOverviewGeneralDashboard =
  async (): Promise<OverviewGeneralDashboardData> => {
    return Promise.resolve(overviewGeneralDashboardData);
  };

export const getOverviewBookingDashboard =
  async (): Promise<OverviewBookingDashboardData> => {
    return Promise.resolve(overviewBookingDashboardData);
  };

export const getOverviewReceivablesDashboard =
  async (): Promise<OverviewReceivablesDashboardData> => {
    return Promise.resolve(overviewReceivablesDashboardData);
  };

export const getOverviewPayablesDashboard =
  async (): Promise<OverviewPayablessDashboardData> => {
    return Promise.resolve(overviewPayablessDashboardData);
  };
