'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog';
import { Label } from '@/core/components/ui/label';
import useUrlParams from '@/core/hooks/use-url-params';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import ReceivablesInvoiceRegisterPayFormContainer from './ReceivablesInvoiceRegisterPayFormContainer';

const ReceivablesInvoiceRegisterPaymentsModalContainer = () => {
  const { updateSearchParams } = useUrlParams();
  const searchParams = useSearchParams();
  const currentModal = searchParams.get('current_modal');
  const invoiceId = searchParams.get('invoiceId');

  const handleOnCloseModal = () =>
    updateSearchParams({
      current_modal: { action: 'delete', value: 'register-payments' },
      invoiceId: { action: 'delete', value: '' },
    });

  const open = useMemo(
    () => currentModal === 'register-payments' && !!invoiceId,
    [currentModal, invoiceId],
  );

  return (
    <Dialog
      {...{
        open,
        onOpenChange: handleOnCloseModal,
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Register payment
          </DialogTitle>
          <Label className="text-sm font-semibold leading-tight text-muted-foreground">
            Insert the value to be able to register a payment
          </Label>
        </DialogHeader>

        {invoiceId ? (
          <ReceivablesInvoiceRegisterPayFormContainer
            {...{ onClose: handleOnCloseModal, invoiceId }}
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <h3 className="font-bold text-xl">No invoice found</h3>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceivablesInvoiceRegisterPaymentsModalContainer;
