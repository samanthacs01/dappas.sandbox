import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { fCurrency, valueFormatter } from '@/core/lib/numbers';
import { ioTypeRender } from '@/modules/commons/statuses/ioTypeRender';
import { InsertionOrder } from '@/server/types/booking';
import { ColumnDef } from '@tanstack/react-table';

const useInsertionOrdersTable = () => {
  const columns: ColumnDef<InsertionOrder>[] = [
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
      accessorKey: 'signed_date',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Signed date"
            align="right"
          />
        );
      },
      cell: ({ row }) => {
        let value = row.getValue<string>('signed_date');
        if (value) {
          value = valueFormatter(value, 'date');
        }
        return <div className="px-4 min-w-max text-right">{value}</div>;
      },
    },
    {
      accessorKey: 'payer',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Payer" />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('payer')}</div>,
    },
    {
      accessorKey: 'advertisers',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Advertiser"
            disableSorting
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 flex flex-col gap-1">
          {row
            .getValue<string[] | undefined>('advertisers')
            ?.map((advertiser) => (
              <span key={`advertiser_${advertiser}`}>{advertiser}</span>
            ))}
        </div>
      ),
    },
    {
      accessorKey: 'medias',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Media" disableSorting />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 flex flex-col gap-1">
          {row
            .getValue<string[] | undefined>('medias')
            ?.map((media) => <span key={`media_${media}`}>{media}</span>)}
        </div>
      ),
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Cost" align="right"/>;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({
            amount: row.getValue('cost'),
          })}
        </div>
      ),
    },
    {
      accessorKey: 'impressions',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Impressions" align="right"/>;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('impressions'), 'number')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Status" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{ioTypeRender(row.getValue('status'))}</div>
      ),
    },
  ];

  return { columns };
};

export default useInsertionOrdersTable;
