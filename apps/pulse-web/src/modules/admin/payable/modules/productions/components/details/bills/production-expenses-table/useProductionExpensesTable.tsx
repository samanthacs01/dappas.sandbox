import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import { getMonthByNumber } from '@/core/lib/date';
import { valueFormatter } from '@/core/lib/numbers';
import { paths } from '@/core/lib/routes';
import { parsePathname } from '@/core/lib/utils';
import { Expenses } from '@/server/types/expenses';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

const useProductionExpensesTable = () => {
  const router = useRouter();
  const { id } = useParams();

  const onViewDetails = (expenseId: string) => {
    router.push(
      parsePathname(paths.expenses.expense_details, {
        productionId: id as string,
        expenseId,
      }),
    );
  };

  const columns: ColumnDef<Expenses>[] = [
    {
      id: 'month_years',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Month/Year' }} />;
      },
      cell: ({ row }) => {
        return (
          <div className="px-4">
            {getMonthByNumber(Number(row.original.month))} {row.original.year}
          </div>
        );
      },
    },
    {
      accessorKey: 'total_deduction',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            {...{ column, label: 'Total Deduction' }}
            align="right"
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">
          {valueFormatter(row.getValue('total_deduction'), 'currency')}
        </div>
      ),
    },
    {
      id: 'action',
      header: () => null,
      cell: ({ row }) => (
        <div className="px-4 flex justify-end">
          <Tooltip title="View details.">
            <Button
              variant={'ghost'}
              onClick={() => onViewDetails(row.original.id.toString())}
            >
              <Eye />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return { columns };
};

export default useProductionExpensesTable;
