'use client';

import { Button } from '@/core/components/ui/button';
import { getMonthByNumber } from '@/core/lib/date';
import { fCurrency } from '@/core/lib/numbers';
import AttachedFilesTableContainer from '@/modules/commons/table/AttachedFilesTableContainer';
import { Expense } from '@/server/types/expenses';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';

type ExpenseDetailsProps = {
  expense: Expense;
};

const ExpenseDetailsContainer: FunctionComponent<ExpenseDetailsProps> = ({
  expense,
}) => {
  const router = useRouter();
  return (
    <div className="container p-8 flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Button
          className="h-7 w-7 px-1 shadow border"
          variant="ghost"
          onClick={router.back}
        >
          <ChevronLeft />
        </Button>
        <h3 className="text-xl font-semibold">
          Production: {expense.production_name}:{' '}
          {getMonthByNumber(+expense.month)}: {expense.year}
        </h3>
      </div>
      <div className="bg-background flex flex-col gap-2 shadow border p-6 rounded-lg">
        <p className="text-base font-semibold">Total deduction</p>
        <p className="text-muted-foreground">
          {fCurrency({
            amount: expense.total_deduction,
            options: { style: 'currency', currency: 'USD' },
          })}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <h3 className="text-xl font-semibold">Attached receipts </h3>
        <AttachedFilesTableContainer
          data={expense.files?.map((file, index) => ({
            id: index,
            file: {
              name: file.name,
              path: (file as unknown as { path: string }).path,
            },
          }))}
        />
      </div>
    </div>
  );
};

export default ExpenseDetailsContainer;
