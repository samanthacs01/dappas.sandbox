export const paths = {
  security: {
    activate_account: '/activate-account',
    link_sent: '/link-sent',
    login: '/login',
    recover_password: '/recover-password',
    reset_password: '/reset-password',
  },
  booking: {
    root: '/booking',
    drafts: { root: '/booking/drafts', reviewDraft: '/booking/drafts/:id' },
    flights: '/booking/flights?status=pending',
    insertion_order: '/booking/insertion-orders',
  },
  expenses: {
    root: '/expenses',
    expense_details:
      '/payables/productions/expense-details/:productionId/:expenseId',
    new_expense: 'expenses/new-expense',
    edit_expense: '/expenses/:expenseId/edit-expense',
  },
  payable: {
    root: '/payables',
    bills: '/payables/bills',
    productions: {
      root: '/payables/productions',
      edit: '/payables/productions/edit/:id',
      new: '/payables/productions/new',
      register_expense: '/payables/productions/register-expense/:id',
      production_details: '/payables/productions/:id/update-production',
      details: {
        bills: '/payables/productions/bills/:id',
        overview: '/payables/productions/overview/:id',
      },
    },
  },
  receivable: {
    root: '/receivables',
    invoices: '/receivables/invoices',
    payers: {
      root: '/receivables/payers',
      edit: '/receivables/payers/edit/:id',
      new: '/receivables/payers/new',
    },
  },
  user_management: {
    root: '/user-management',
    create_user: '/user-management/create-user',
  },
  overview: '/overview',
  logs: {
    root: '/activity-logs',
  },
  production: {
    root: '/production',
    details: {
      overview: '/production/overview',
      bills: '/production/bills',
    },
  },
};
