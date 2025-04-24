import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { valueFormatter } from '@/core/lib/numbers';
import { statusTypeRender } from '@/modules/commons/statuses/statusTypeRender';
import { PayableProductionBill } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';

const useProductionBillingTable = () => {
  const columns: ColumnDef<PayableProductionBill>[] = [
    {
      accessorKey: 'month',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Month' }} />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('month')}</div>,
    },
    {
      accessorKey: 'revenue',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Revenue' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('revenue'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'expenses',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Expenses' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('expenses'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'net_due',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Net Due' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('net_due'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Balance' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('balance'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'due_date',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Est. Paym. Date' }} />;
      },
      cell: ({ row }) => {
        const stringValue = row.getValue<string | null>('due_date');
        const formattedValue = valueFormatter(stringValue ?? '', 'date');
        return <div className="px-4">{formattedValue}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Status' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {statusTypeRender(row.getValue<string>('status'))}
        </div>
      ),
    },
  ];

  return { columns };
};

export default useProductionBillingTable;
