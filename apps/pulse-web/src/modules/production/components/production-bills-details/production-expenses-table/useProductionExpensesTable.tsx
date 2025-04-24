import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Button } from '@/core/components/ui/button';
import { getMonthByNumber } from '@/core/lib/date';
import { valueFormatter } from '@/core/lib/numbers';
import { paths } from '@/core/lib/routes';
import { parsePathname } from '@/core/lib/utils';
import { Expenses } from '@/server/types/expenses';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const useProductionExpensesTable = () => {
  const router = useRouter();
  const goToExpenseDetails = (expenseId: string) => {
    router.push(parsePathname(paths.expenses.expense_details, { expenseId }));
  };

  const columns: ColumnDef<Expenses>[] = [
    {
      accessorKey: 'month_years',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Month/Year' }} />;
      },
      cell: ({ row }) => {
        return (
          <div className="px-4">
            {getMonthByNumber(Number(row.original?.month))}/{row.original?.year}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_deduction',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Total deduction' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('total_deduction'), 'currency')}
        </div>
      ),
    },
    {
      id: 'action',
      header: () => null,
      cell: ({ row }) => (
        <div className="px-4 flex justify-end">
          <Button
            variant={'ghost'}
            onClick={() => goToExpenseDetails(row.getValue('id'))}
          >
            <Eye />
          </Button>
        </div>
      ),
    },
  ];

  return { columns };
};

export default useProductionExpensesTable;
