import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { valueFormatter } from '@/core/lib/numbers';
import { flightTypeRender } from '@/modules/commons/statuses/flightTypeRender';
import { PayableProductionFlight } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';

const useProductionFlightsTable = () => {
  const columns: ColumnDef<PayableProductionFlight>[] = [
    {
      accessorKey: 'flight',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Flight ID' }} />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('flight')}</div>
      ),
    },
    {
      accessorKey: 'payer',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Payer' }} />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('payer')}</div>,
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
          {flightTypeRender(row.getValue('status'))}
        </div>
      ),
    },
  ];

  return { columns };
};

export default useProductionFlightsTable;
