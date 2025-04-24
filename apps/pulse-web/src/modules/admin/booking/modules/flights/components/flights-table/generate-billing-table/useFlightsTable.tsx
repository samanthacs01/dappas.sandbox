import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { valueFormatter } from '@/core/lib/numbers';
import { Invoice } from '@/server/types/booking';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

const useInvoicesTable = () => {
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'payer',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Payer" disableSorting />
        );
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('payer')}</div>,
    },
    {
      accessorKey: 'amount_to_pay',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Amount to pay"
            disableSorting
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4">
          {valueFormatter(row.getValue('amount_to_pay'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'payment_terms',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Payment terms"
            disableSorting
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4">{`Net ${row.getValue('payment_terms')} Days`}</div>
      ),
    },
    {
      accessorKey: 'due_date',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Due date" disableSorting />
        );
      },
      cell: ({ row }) => {
        const stringValue = row.getValue<string>('due_date');
        const formattedValue = format(new Date(stringValue), 'MM-dd-yyyy');
        return <div className="px-4">{formattedValue}</div>;
      },
    },
  ];

  return { columns };
};

export default useInvoicesTable;
