import ExpensesContainer from '@/modules/admin/expenses/containers/ExpensesContainer';
import { SearchParams } from '@/server/types/params';

export default async function Page(props: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const searchParams = await props.searchParams;
  return <ExpensesContainer {...{ searchParams }} />;
}
