'use client';
import { Button } from '@/core/components/ui/button';
import useUrlParams from '@/core/hooks/use-url-params';
import { TableGenerateBillingModalContainer } from '@/modules/admin/booking/containers/GenerateBillingModalContainer';
import { generateInvoices } from '@/server/services/invoices';
import { Flight, Invoice } from '@/server/types/booking';
import { CircleDollarSign, LoaderCircle } from 'lucide-react';
import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';


type FlightsActionProps = {
  selectedRows: Flight[];
  clearSelection: VoidFunction;
};

export const FlightsAction: FC<FlightsActionProps> = ({
  selectedRows,
  clearSelection,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { updateSearchParams } = useUrlParams();
  const disableGenerateBilling = useMemo(
    () =>
      !selectedRows.length ||
      selectedRows.some((row) => row.status === 'invoiced'),
    [selectedRows.length],
  );

  const openGenerateBilling = async () => {
    setLoading(true);
    const invoices = await generateInvoices(
      selectedRows?.map((row) => row.id) ?? [],
    );

    if (!invoices.success || !invoices.data) {
      toast.error('Failed to generate invoices');
    } else {
      setInvoices(invoices.data);
      updateSearchParams({
        currentModal: { action: 'set', value: 'generate-billing' },
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center space-x-2 justify-end">
        <Button
          disabled={disableGenerateBilling || loading}
          onClick={openGenerateBilling}
          data-cy="generate-billing"
        >
          {!loading ? (
            <CircleDollarSign />
          ) : (
            <LoaderCircle className="animate-spin w-4 h-4 text-secondary" />
          )}
          Generate billing
        </Button>
      </div>
      <TableGenerateBillingModalContainer
        data={invoices}
        clearSelection={clearSelection}
      />
    </>
  );
};
