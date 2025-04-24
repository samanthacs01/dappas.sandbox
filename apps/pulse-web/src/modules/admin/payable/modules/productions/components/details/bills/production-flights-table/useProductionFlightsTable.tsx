import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { adaptPayableProductionFlightToPayableBills } from '@/core/lib/adapters';
import { valueFormatter } from '@/core/lib/numbers';
import { statusTypeRender } from '@/modules/commons/statuses/statusTypeRender';
import { PayableBills, PayableProductionFlight } from '@/server/types/payable';
import { ColumnDef } from '@tanstack/react-table';
import { CreditCard } from 'lucide-react';

const useProductionFlightsTable = () => {
  const { updateSearchParams } = useUrlParams();
  const onPayFlight = (flight: PayableProductionFlight) => {
    updateSearchParams({
      current_modal: { action: 'set', value: 'register-payments' },
      bill_id: { action: 'set', value: flight.id },
    });
    const bill: PayableBills =
      adaptPayableProductionFlightToPayableBills(flight);
    localStorage.setItem('local_bills', JSON.stringify(bill));
  };

  const columns: ColumnDef<PayableProductionFlight>[] = [
    {
      accessorKey: 'flight',
      header: ({ column }) => {
        return <TableColumnHeader {...{ column, label: 'Flight ID' }} />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('flight')}</div>,
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
        <div className="px-4">{statusTypeRender(row.getValue('status'))}</div>
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
              <Button
                variant={'ghost'}
                onClick={() => onPayFlight(row.original)}
              >
                <CreditCard />
              </Button>
            </Tooltip>
          </div>
        ),
    },
  ];

  return { columns };
};

export default useProductionFlightsTable;
