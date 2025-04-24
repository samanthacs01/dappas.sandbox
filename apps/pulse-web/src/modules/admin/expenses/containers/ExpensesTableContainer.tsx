import { getExpenses } from '@/server/services/expenses';
import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import ExpensesTable from '../components/expenses-table/ExpensesTable';

type ExpensesProps = {
  searchParams: SearchParams;
};

const ExpensesTableContainer: FunctionComponent<ExpensesProps> = async ({
  searchParams,
}) => {
  const { items, pagination } = await getExpenses(searchParams);
  
  return <ExpensesTable {...{ data: items, pagination }} />;
};

export default ExpensesTableContainer;
