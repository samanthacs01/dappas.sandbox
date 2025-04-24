'use client';
import { Button } from '@/core/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import { revalidateServerTags } from '@/core/lib/cache';
import { acceptInvoices } from '@/server/services/invoices';
import { Invoice } from '@/server/types/booking';
import { Dialog, DialogDescription } from '@radix-ui/react-dialog';
import { LoaderCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { InvoicesTable } from './GenerateBillingTable';

type GenerateBillingModalProps = {
  data: Invoice[];
  open: boolean;
  onClose: () => void;
  clearSelection: VoidFunction;
};

const GenerateBillingModal: FC<GenerateBillingModalProps> = ({
  data,
  onClose,
  open,
  clearSelection,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const acceptBilling = async () => {
    setLoading(true);
    const response = await acceptInvoices(data.map((invoice) => invoice.id));
    if (!response.success) {
      toast.error('Failed to generate bill');
    } else {
      await revalidateServerTags('flights');
      await revalidateServerTags('payable-bills');
      await revalidateServerTags('invoices');
      toast.success('Bill generated successfully');
      onClose();
    }
    clearSelection();
    // wait to url change and the modal close to enable the button
    setTimeout(() => setLoading(false), 1000);
  };
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Generate billing
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-tight text-muted-foreground">
            You are about to generate the following Bills
          </DialogDescription>
        </DialogHeader>
        <InvoicesTable data={data} />
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant={'outline'}
              disabled={loading}
              onClick={() => !loading && onClose()}
              data-cy="close-billing-modal"
            >
              Cancel
            </Button>
            <Button
              variant={'default'}
              onClick={acceptBilling}
              disabled={loading}
              data-cy="accept-billing-modal"
            >
              Continue
              {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBillingModal;
