import { fCurrency } from '@/core/lib/numbers';
import { paths } from '@/core/lib/routes';
import { parsePathname } from '@/core/lib/utils';
import { paymentTypeRender } from '@/modules/commons/statuses/paymentTypeRender';
import { ProductionListDto } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import useUrlParams from '@/core/hooks/use-url-params';
import { addFromToUrl } from '@/core/lib/request';
import ProductionTableActions from '../ProductionTableActions';

const useProductionTableColumns = () => {
  const { updateSearchParams } = useUrlParams();
  const router = useRouter();

  const onRemoveProduction = (id: number) => {
    updateSearchParams({
      currentModal: { action: 'set', value: 'delete-production' },
      productionId: { action: 'set', value: id.toString() },
    });
  };

  const columns: ColumnDef<ProductionListDto>[] = [
    {
      accessorKey: 'entity_name',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Production" />;
      },
      cell: ({ row }) => (
        <Link
          className="hover:underline"
          href={addFromToUrl(
            parsePathname(paths.payable.productions.details.overview, {
              id: row.original.id,
            }),
          )}
        >
          <div className="px-4">{row.getValue('entity_name')}</div>
        </Link>
      ),
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Balance" align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({
            amount: Number(row.getValue('balance')),
            options: {
              style: 'currency',
              currency: 'USD',
              currencyDisplay: 'symbol',
            },
          })}
        </div>
      ),
    },
    {
      accessorKey: 'dpo',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="DPO" align="right" />;
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">{row.getValue('dpo')}</div>
      ),
    },
    {
      accessorKey: 'payment_type',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Payment type" />;
      },
      cell: ({ row }) => (
        <div className="px-4">
          {paymentTypeRender(row.getValue('payment_type'))}
        </div>
      ),
    },
    {
      id: 'id',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <ProductionTableActions
            {...{
              onEdit: () =>
                router.push(
                  paths.payable.productions.edit.replace(
                    ':id',
                    row.original.id.toString(),
                  ),
                ),
              onRemove: () => onRemoveProduction(row.original.id),
              onRegisterExpense: () =>
                router.push(
                  paths.payable.productions.register_expense.replace(
                    ':id',
                    row.original.id.toString(),
                  ),
                ),
            }}
          />
        );
      },
    },
  ];

  return { columns };
};

export default useProductionTableColumns;
