import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { convertPayableProductionBillToPayableBills } from '@/core/lib/adapters';
import { valueFormatter } from '@/core/lib/numbers';
import { statusTypeRender } from '@/modules/commons/statuses/statusTypeRender';
import { PayableBills, PayableProductionBill } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard } from 'lucide-react';

const useProductionBillingTable = () => {
  const { updateSearchParams } = useUrlParams();
  const handlePay = (productionBill: PayableProductionBill) => {
    updateSearchParams({
      current_modal: { action: 'set', value: 'register-payments' },
      bill_id: { action: 'set', value: productionBill.id },
    });
    const bill: PayableBills =
      convertPayableProductionBillToPayableBills(productionBill);
    localStorage.setItem('local_bills', JSON.stringify(bill));
  };

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
        return (
          <TableColumnHeader {...{ column, label: 'Revenue' }} align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">
          {valueFormatter(row.getValue('revenue'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'expenses',
      header: ({ column }) => {
        return (
          <TableColumnHeader {...{ column, label: 'Expenses' }} align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">
          {valueFormatter(row.getValue('expenses'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'net_due',
      header: ({ column }) => {
        return (
          <TableColumnHeader {...{ column, label: 'Net Due' }} align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">
          {valueFormatter(row.getValue('net_due'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => {
        return (
          <TableColumnHeader {...{ column, label: 'Balance' }} align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 text-right">
          {valueFormatter(row.getValue('balance'), 'currency')}
        </div>
      ),
    },
    {
      accessorKey: 'due_date',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            {...{ column, label: 'Est. Paym. Date' }}
            align="right"
          />
        );
      },
      cell: ({ row }) => {
        const stringValue = row.getValue<string | null>('due_date');
        const formattedValue = valueFormatter(stringValue ?? '', 'date');
        return <div className="px-4 text-right">{formattedValue}</div>;
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
    {
      id: 'action',
      header: () => null,
      cell: ({ row }) =>
        row.original.status !== 'paid' &&
        !!row.original.due_date && (
          <div className="px-4 flex justify-end">
            <Tooltip title="Register payment.">
              <Button variant={'ghost'} onClick={() => handlePay(row.original)}>
                <CreditCard />
              </Button>
            </Tooltip>
          </div>
        ),
    },
  ];

  return { columns };
};

export default useProductionBillingTable;
