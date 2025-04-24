import ErrorDisplay from '@/core/components/common/error/error-display';
import { paths } from '@/core/lib/routes';
import ExpenseDetailsContainer from '@/modules/admin/expenses/containers/ExpenseDetailsContainer';
import { getExpense } from '@/server/services/expenses';
import { notFound } from 'next/navigation';

type ExpenseDetailsProps = {
  params: Promise<{ expenseId: string }>;
};

export default async function Page(props: Readonly<ExpenseDetailsProps>) {
  const params = await props.params;
  try {
    const res = await getExpense(params.expenseId);

    if (!res.success || !res.data) {
      notFound();
    }

    return <ExpenseDetailsContainer expense={res.data} />;
  } catch (error) {
    console.error('Error fetching expense:', error);
    return (
      <ErrorDisplay
        href={paths.expenses.root}
        link_text="Return to Expenses"
        message="We couldn't load the expense details. Please try again later."
      />
    );
  }
}
