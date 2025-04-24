import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Checkbox } from '@/core/components/ui/checkbox';
import { valueFormatter } from '@/core/lib/numbers';
import { flightTypeRender } from '@/modules/commons/statuses/flightTypeRender';
import { Flight } from '@/server/types/booking';
import { ColumnDef } from '@tanstack/react-table';

const useFlightsTable = () => {
  const columns: ColumnDef<Flight>[] = [
    {
      id: 'id',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          data-cy="flights-table-select-all-checkbox"
        />
      ),
      cell: ({ row }) => (
        <div className="h-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            data-cy="flights-table-select-row-checkbox"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'identifier',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Flight id" />;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max">{row.getValue('identifier')}</div>
      ),
    },
    {
      accessorKey: 'insertion_order',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Order no." />;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max">{row.getValue('insertion_order')}</div>
      ),
    },
    {
      accessorKey: 'payer',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Payer" />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('payer')}</div>,
    },
    {
      accessorKey: 'advertiser',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Advertiser" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('advertiser')}</div>
      ),
    },
    {
      accessorKey: 'media',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Media" />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('media')}</div>,
    },
    {
      accessorKey: 'production',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Production" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('production')}</div>
      ),
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Cost" align="right" />;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('cost'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'impressions',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Flights impressions"
            align="right"
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('impressions'), 'number')}
        </div>
      ),
    },
    {
      accessorKey: 'drop_dates',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Run date / range"
            align="right"
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right flex flex-col gap-1">
          {row
            .getValue<string[] | undefined>('drop_dates')
            ?.map((date, index) => <span key={`date-${date}-${index}`}>{date}</span>)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Status" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{flightTypeRender(row.getValue('status'))}</div>
      ),
    },
  ];

  return { columns };
};

export default useFlightsTable;
