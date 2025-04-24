'use client';
import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { fCurrency, valueFormatter } from '@/core/lib/numbers';
import { paymentTypeRender } from '@/modules/commons/statuses/paymentTypeRender';
import { statusTypeRender } from '@/modules/commons/statuses/statusTypeRender';
import { PayableBills } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard } from 'lucide-react';

const useBillsTable = () => {
  const { updateSearchParams } = useUrlParams();

  const handleOnEdit = (bill: PayableBills) => {
    updateSearchParams({
      current_modal: { action: 'set', value: 'register-payments' },
      bill_id: { action: 'set', value: bill.id },
    });
    localStorage.setItem('local_bills', JSON.stringify(bill));
  };

  const columns: ColumnDef<PayableBills>[] = [
    {
      accessorKey: 'identifier',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Bill ID" />
      ),
      cell: ({ row }) => (
        <div className="px-4 min-w-max">{row.getValue('identifier')}</div>
      ),
    },
    {
      accessorKey: 'production',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Productions" />
      ),
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('production')}</div>
      ),
    },
    {
      accessorKey: 'payment_type',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Payment type" />
      ),
      cell: ({ row }) => (
        <div className="px-4">
          {paymentTypeRender(row.getValue('payment_type'))}
        </div>
      ),
    },
    {
      accessorKey: 'flight_month',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Flight/Month" />
      ),
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('flight_month') ?? '-'}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Amount" align="right" />
      ),
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({ amount: row.getValue('amount') })}
        </div>
      ),
    },
    {
      accessorKey: 'balance',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Balance" align="right" />
      ),
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({ amount: row.getValue('balance') })}
        </div>
      ),
    },
    {
      accessorKey: 'due_date',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Due date" align="right" />
      ),
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('due_date'), 'date')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <TableColumnHeader column={column} label="Status" />
      ),
      cell: ({ row }) => (
        <div className="px-4">{statusTypeRender(row.getValue('status'))}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) =>
        row.original.status !== 'paid' &&
        !!row.original.due_date && (
          <div className="px-4">
            <Tooltip title="Register payment.">
              <Button
                variant={'ghost'}
                onClick={() => handleOnEdit(row.original)}
              >
                <CreditCard width={16} height={16} />
              </Button>
            </Tooltip>
          </div>
        ),
    },
  ];
  return { columns };
};

export default useBillsTable;
