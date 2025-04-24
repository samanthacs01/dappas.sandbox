import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { fCurrency, valueFormatter } from '@/core/lib/numbers';
import { statusTypeRender } from '@/modules/commons/statuses/statusTypeRender';
import { ReceivablesInvoices } from '@/server/types/receivables';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard } from 'lucide-react';

const useReceivablesInvoicesTable = () => {
  const { updateSearchParams } = useUrlParams();

  const handleOnRegisterPayment = (invoice: ReceivablesInvoices) => {
    updateSearchParams({
      invoiceId: { action: 'set', value: invoice.id },
      current_modal: { action: 'set', value: 'register-payments' },
    });
    localStorage.setItem('local-invoice', JSON.stringify(invoice));
  };

  const columns: ColumnDef<ReceivablesInvoices>[] = [
    {
      accessorKey: 'identifier',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Invoice ID" />;
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max">{row.getValue('identifier')}</div>
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
      accessorKey: 'productions',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Production(s)" />;
      },
      cell: ({ row }) => (
        <div className="px-4 flex flex-col gap-1">
          {row
            .getValue<string[] | undefined>('productions')
            ?.map((production) => (
              <span key={`production-${production}`}>{production}</span>
            ))}
        </div>
      ),
    },
    {
      accessorKey: 'advertisers',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Advertiser" />;
      },
      cell: ({ row }) => (
        <div className="px-4 flex flex-col gap-1">
          {row
            .getValue<string[] | undefined>('advertisers')
            ?.map((advertiser) => (
              <span key={`advertiser-${advertiser}`}>{advertiser}</span>
            ))}
        </div>
      ),
    },
    {
      accessorKey: 'bills',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Bill(s)" />;
      },
      cell: ({ row }) => (
        <div className="px-4 flex flex-col gap-1 min-w-max">
          {row
            .getValue<string[] | undefined>('bills')
            ?.map((bill) => <span key={`bill-${bill}`}>{bill}</span>)}
        </div>
      ),
    },
    {
      accessorKey: 'amount_to_pay',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Amount" align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({
            amount: row.getValue('amount_to_pay'),
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
      accessorKey: 'balance',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Balance" align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {fCurrency({
            amount: row.getValue('balance'),
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
      accessorKey: 'payment_terms',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Payment terms" />;
      },
      cell: ({ row }) => (
        <div className="px-4">Net {row.getValue('payment_terms')} Days</div>
      ),
    },
    {
      accessorKey: 'invoice_date',
      header: ({ column }) => {
        return (
          <TableColumnHeader
            column={column}
            label="Date invoiced"
            align="right"
          />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('invoice_date'), 'date')}
        </div>
      ),
    },
    {
      accessorKey: 'due_date',
      header: ({ column }) => {
        return (
          <TableColumnHeader column={column} label="Due date" align="right" />
        );
      },
      cell: ({ row }) => (
        <div className="px-4 min-w-max text-right">
          {valueFormatter(row.getValue('due_date'), 'date')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Status" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{statusTypeRender(row.getValue('status'))}</div>
      ),
    },
    {
      accessorKey: 'id',
      header: () => null,
      cell: ({ row }) => {
        if (
          row.getValue<string | undefined>('status')?.toLowerCase() === 'paid'
        )
          return null;
        return (
          <div className="px-4">
            <Tooltip title="Register payment">
              <Button
                variant={'ghost'}
                onClick={() => handleOnRegisterPayment(row.original)}
              >
                <CreditCard width={16} height={16} />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return { columns };
};

export default useReceivablesInvoicesTable;
