import TableSkeletons from '@/core/components/common/skeletons/table-skeletons';
import { Button } from '@/core/components/ui/button';
import { paths } from '@/core/lib/routes';
import { SearchParams } from '@/server/types/params';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent, Suspense } from 'react';
import ExpensesTableContainer from './ExpensesTableContainer';

type ExpensesProps = {
  searchParams: SearchParams;
};

const ExpensesContainer: FunctionComponent<ExpensesProps> = ({
  searchParams,
}) => {
  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <h3 className="text-lg font-semibold">Expenses list</h3>
        <Link href={paths.expenses.new_expense}>
          <Button>
            <Plus />
            Create expenses
          </Button>
        </Link>
      </div>
      <Suspense fallback={<TableSkeletons columns={7} rows={10} />}>
        <ExpensesTableContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
};

export default ExpensesContainer;
