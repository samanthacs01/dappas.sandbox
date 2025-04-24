const ROOT_PATHS = `${process.env.NEXT_APP_API_URL}`;
export const BACKEND_ROUTES = {
  security: {
    auth: `${ROOT_PATHS}/security/auth`,
    logout: `${ROOT_PATHS}/security/logout`,
    change_password: `${ROOT_PATHS}/users/change_password`,
    recover_password: `${ROOT_PATHS}/users/recovery`,
  },
  dashboard: {
    filters: {
      payers: `${ROOT_PATHS}/filters/payers`,
      productions: `${ROOT_PATHS}/filters/productions`,
      advertiser: `${ROOT_PATHS}/filters/advertisers`
    },
    payers: {
      list: `${ROOT_PATHS}/payers`,
      create: `${ROOT_PATHS}/payers`,
      delete: `${ROOT_PATHS}/payers/:id`,
      get: `${ROOT_PATHS}/payers/:id`,
    },
    booking: {
      flights: {
        list: `${ROOT_PATHS}/booking/flights`,
      },
      io: {
        list: `${ROOT_PATHS}/booking/insertion_orders`,
        create: `${ROOT_PATHS}/booking/orders`,
      },
      drafts: {
        list: `${ROOT_PATHS}/booking/drafts`,
        details: `${ROOT_PATHS}/booking/drafts/:id`,
        review: `${ROOT_PATHS}/booking/drafts/:id/review`,
        pending: `${ROOT_PATHS}/booking/drafts_pending`,
      },
      files: {
        processingStatus: `${ROOT_PATHS}/booking/files_processing_status`,
      },
      overview: {
        stats: `${ROOT_PATHS}/booking/stats`,
        booking_values: `${ROOT_PATHS}/booking/stats/booking_value`,
        fulfillment_rate: `${ROOT_PATHS}/booking/stats/fulfillment_rate`,
        payer_concentration: `${ROOT_PATHS}/booking/stats/payers_concentration`,
        production_concentration: `${ROOT_PATHS}/booking/stats/productions_concentration`,
      },
    },
    payable: {
      list: `${ROOT_PATHS}/payable`,
      create_productions: `${ROOT_PATHS}/productions`,
      update_production: `${ROOT_PATHS}/productions/:id`,
      get_production: `${ROOT_PATHS}/productions/:id`,
      delete_production: `${ROOT_PATHS}/productions/:id`,
      list_bills: `${ROOT_PATHS}/payables/bills`,
      register_payment: `${ROOT_PATHS}/payables/bills/:id/payment`,
      production_bills: `${ROOT_PATHS}/payables/bills/billing`,
      production_expenses: `${ROOT_PATHS}/productions/expenses/collection`,
      production_flights: `${ROOT_PATHS}/payables/bills/collection`,
      overview: {
        stats: `${ROOT_PATHS}/payables/overview/stats`,
        charts: `${ROOT_PATHS}/payables/overview/:type`,
        stack_chart: `${ROOT_PATHS}/payables/overview/stack/:type`,
        production_details: {
          stats: `${ROOT_PATHS}/production-details/overview/stats`,
          charts: `${ROOT_PATHS}/production-details/overview/stats/:type`,
        },
      },
    },
    productions: {
      list: `${ROOT_PATHS}/productions`,
    },
    expenses: {
      list: `${ROOT_PATHS}/expenses`,
      create: `${ROOT_PATHS}/expenses`,
      delete: `${ROOT_PATHS}/expenses/:id`,
      by_id: `${ROOT_PATHS}/expenses/:id`,
      update: `${ROOT_PATHS}/expenses/:id`,
    },
    users: {
      list: `${ROOT_PATHS}/users`,
      by_id: `${ROOT_PATHS}/users/:id`,
      create: `${ROOT_PATHS}/users`,
      update: `${ROOT_PATHS}/users/:id`,
      delete: `${ROOT_PATHS}/users/:id`,
      resend: `${ROOT_PATHS}/users/:id/resend_email`,
    },
    invoices: {
      root: `${ROOT_PATHS}/invoices`,
      accept: `${ROOT_PATHS}/invoices/accept`,
      generate: `${ROOT_PATHS}/invoices/generate`,
      payment: `${ROOT_PATHS}/invoices/:id/payment`,
      export: `${ROOT_PATHS}/invoices/export`,
    },
    receivables: {
      overview_stats: `${ROOT_PATHS}/receivables/overview/stats`,
      total_outstanding: `${ROOT_PATHS}/receivables/overview/outstanding`,
      overdue: `${ROOT_PATHS}/receivables/overview/overdue`,
      collection_overall: `${ROOT_PATHS}/receivables/overview/collection_over_all`,
      collection_with_payment_terms: `${ROOT_PATHS}/receivables/overview/collection_with_payment_terms`,
      customer_concentration: `${ROOT_PATHS}/receivables/overview/customer_concentration`,
    },
    logs: {
      list: `${ROOT_PATHS}/activity_logs`,
    },
    overview: {
      generalStats: `${ROOT_PATHS}/overview/stats`,
      total_revenue: `${ROOT_PATHS}/overview/stats/overview_total_revenue`,
      gross_margin: `${ROOT_PATHS}/overview/stats/gross_margin`,
      dso: `${ROOT_PATHS}/overview/stats/dso`,
      dpo: `${ROOT_PATHS}/overview/stats/dpo`,
    },
  },
};
