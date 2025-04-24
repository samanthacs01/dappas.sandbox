import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { getMonthByNumber } from '@/core/lib/date';
import { valueFormatter } from '@/core/lib/numbers';
import { paths } from '@/core/lib/routes';
import { parsePathname } from '@/core/lib/utils';
import { Expenses } from '@/server/types/expenses';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, FilePen, Trash } from 'lucide-react';
import Link from 'next/link';

const useExpensesTable = () => {
  const { updateSearchParams } = useUrlParams();

  const handleOnDeleteExpense = async (id: string) => {
    updateSearchParams({
      currentModal: {
        action: 'set',
        value: 'delete-expense',
      },
      expenseId: {
        action: 'set',
        value: id,
      },
    });
  };

  const columns: ColumnDef<Expenses>[] = [
    {
      accessorKey: 'month_years',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Month/Year" />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {getMonthByNumber(+row.original.month)} {row.original.year}
        </div>
      ),
    },
    {
      accessorKey: 'production_name',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Production" />;
      },
      cell: ({ row }) => (
        <div className="px-4 hover:underline">
          <Link
            href={paths.payable.productions.details.overview.replace(
              ':id',
              row.original.production_id.toString(),
            )}
          >
            {row.getValue('production_name')}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: 'total_deduction',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Total deductions"
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
      accessorKey: 'id',
      header: () => null,
      cell: ({ row }) => {
        return (
          <div className="px-4 flex gap-1 justify-end">
            <Link
              href={parsePathname(paths.expenses.expense_details, {
                expenseId: row.original.id,
                productionId: row.original.production_id,
              })}
            >
              <Tooltip title="View details.">
                <Button variant={'ghost'} className="w-10 h-10">
                  <Eye />
                </Button>
              </Tooltip>
            </Link>
            <Link
              href={paths.expenses.edit_expense.replace(
                ':expenseId',
                row.getValue('id'),
              )}
            >
              <Tooltip title="Edit.">
                <Button variant={'ghost'} className="w-10 h-10">
                  <FilePen />
                </Button>
              </Tooltip>
            </Link>

            <Tooltip title="Delete.">
              <Button
                variant={'ghost'}
                className="w-10 h-10"
                onClick={() => handleOnDeleteExpense(row.getValue('id'))}
              >
                <Trash />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return { columns };
};

export default useExpensesTable;
