'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/core/components/ui/dialog';
import useUrlParams from '@/core/hooks/use-url-params';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';
import RegisterBillsPaymentFormContainer from '../modules/bills/components/forms/RegisterBillsPaymentFormContainer';

const RegisterPaymentModalContainer = () => {
  const { updateSearchParams } = useUrlParams();
  const searchParams = useSearchParams();
  const current_modal = searchParams.get('current_modal');
  const bill_id = searchParams.get('bill_id');

  const handleOnOpenChange = () => {
    updateSearchParams({
      current_modal: { action: 'delete', value: 'register-payments' },
      bill_id: { action: 'delete', value: '' },
    });
  };

  return (
    <Dialog
      {...{
        open: current_modal === 'register-payments',
        onOpenChange: handleOnOpenChange,
      }}
    >
      <DialogContent aria-describedby="register-payments">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Register payment
          </DialogTitle>
          <DialogDescription
            id="register-payments-description"
            className="sr-only"
          >
            Form to register a new payment for bills
          </DialogDescription>
        </DialogHeader>
        <RegisterBillsPaymentFormContainer
          {...{ onClose: handleOnOpenChange, bill_id }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RegisterPaymentModalContainer;
