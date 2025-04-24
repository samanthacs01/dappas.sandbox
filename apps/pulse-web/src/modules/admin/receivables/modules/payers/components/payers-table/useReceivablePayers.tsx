import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { paths } from '@/core/lib/routes';
import { ReceivablePayers } from '@/server/types/receivables';
import { ColumnDef } from '@tanstack/react-table';
import { Pen, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const useReceivablePayers = () => {
  const router = useRouter();
  const { updateSearchParams } = useUrlParams();

  const handleOnEditPayer = (id: string) => {
    router.push(paths.receivable.payers.edit.replace(':id', id));
  };

  const handleOnDeletePayer = async (id: string) => {
    updateSearchParams({
      currentModal: { action: 'set', value: 'delete-payer' },
      payerId: { action: 'set', value: id },
    });
  };

  const columns: ColumnDef<ReceivablePayers>[] = useMemo(
    (): ColumnDef<ReceivablePayers>[] => [
      {
        accessorKey: 'entity_name',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Entity name" />;
        },
        cell: ({ row }) => (
          <div className="px-4">{row.getValue('entity_name')}</div>
        ),
      },
      {
        accessorKey: 'entity_address',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Entity address" />;
        },
        cell: ({ row }) => (
          <div className="px-4">{row.getValue('entity_address')}</div>
        ),
      },
      {
        accessorKey: 'contact_name',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Contact name" />;
        },
        cell: ({ row }) => (
          <div className="px-4">{row.getValue('contact_name')}</div>
        ),
      },
      {
        accessorKey: 'contact_phone_number',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Contact phone" />;
        },
        cell: ({ row }) => (
          <div className="px-4">{row.getValue('contact_phone_number')}</div>
        ),
      },
      {
        accessorKey: 'contact_email',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Contact email" />;
        },
        cell: ({ row }) => (
          <div className="px-4">{row.getValue('contact_email')}</div>
        ),
      },
      {
        accessorKey: 'payment_terms',
        header: ({ column }) => {
          return <TableColumnHeader column={column} label="Payment terms" />;
        },
        cell: ({ row }) => (
          <div className="px-4">Net {row.getValue('payment_terms')} Days</div>
        ),
      },
      {
        accessorKey: 'id',
        header: () => null,
        cell: ({ row }) => (
          <div className="px-4 flex gap-1">
            <Tooltip title="Edit.">
              <Button
                variant="ghost"
                onClick={() => handleOnEditPayer(row.original.id.toString())}
                className="w-10 h-10"
              >
                <Pen />
              </Button>
            </Tooltip>
            <Tooltip title="Delete.">
              <Button
                variant="ghost"
                color="destructive"
                onClick={() => handleOnDeletePayer(row.getValue('id'))}
                className="w-10 h-10"
              >
                <Trash />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [],
  );
  return { columns };
};

export default useReceivablePayers;
