import ErrorDisplay from '@/core/components/common/error/error-display';
import { getExpense } from '@/server/services/expenses';
import { FunctionComponent } from 'react';
import { ExpensesDetails } from './ExpensesDetails';

type ExpenseDetailsProps = {
  expenseId: string;
};

export const ExpenseDetailsContainer: FunctionComponent<
  ExpenseDetailsProps
> = async ({ expenseId }) => {
  const { data } = await getExpense(expenseId);
  if (!data) {
    return (
      <ErrorDisplay
        message={'Something went wrong getting the expansion data'}
      />
    );
  }

  return <ExpensesDetails expense={data} />;
};
