import ErrorDisplay from '@/core/components/common/error/error-display';
import { paths } from '@/core/lib/routes';
import { getExpense } from '@/server/services/expenses';
import { FC } from 'react';
import NewExpenseFormContainer from './NewExpenseFormContainer';

type EditExpenseProps = {
  expenseId: string;
};

const EditExpenseContainer: FC<EditExpenseProps> = async ({ expenseId }) => {
  const res = await getExpense(expenseId);
  if (!res.success || !res.data)
    return (
      <ErrorDisplay
        href={paths.expenses.root}
        link_text="Return to Expenses"
        message="We couldn't load the expense. Please try again later."
      />
    );

  return <NewExpenseFormContainer expense={res.data} />;
};

export default EditExpenseContainer;
