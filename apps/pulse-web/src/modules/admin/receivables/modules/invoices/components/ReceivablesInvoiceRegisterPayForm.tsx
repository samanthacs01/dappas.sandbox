import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { Button } from '@/core/components/ui/button';
import { fCurrency } from '@/core/lib/numbers';
import { ReceivablesInvoices } from '@/server/types/receivables';
import { Loader2 } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type InvoiceRegisterPayProps = {
  receivableInvoice: ReceivablesInvoices;
  loading: boolean;
  onClose: () => void;
};

const ReceivablesInvoiceRegisterPayForm: FunctionComponent<
  InvoiceRegisterPayProps
> = ({ receivableInvoice, loading, onClose }) => {
  const {
    identifier: invoiceId,
    amount_to_pay: amount,
    payer,
  } = receivableInvoice;
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 shadow-sm border p-6 rounded-lg">
        <div className="flex justify-between">
          <h3 className="text-base font-semibold flex-1">Invoice ID:</h3>
          <p className="text-sm text-muted-foreground flex-1 text-right">
            {invoiceId}
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-base font-semibold flex-1">Payer:</h3>
          <p className="text-sm text-muted-foreground flex-1 text-right">
            {payer}
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-base font-semibold flex-1">Invoice amount:</h3>
          <p className="text-sm text-muted-foreground flex-1 text-right">
            {fCurrency({ amount })}
          </p>
        </div>
        <div className="flex justify-between">
          <h3 className="text-base font-semibold">Payment amount:</h3>
          <RHFTextField
            name="payment_amount"
            type="number"
            placeholder="Enter the amount to pay"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant={'outline'}
          onClick={onClose}
          disabled={loading}
          type="button"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !isValidForm}>
          {loading ? (
            <span className="flex gap-2 items-center">
              Registering...
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </span>
          ) : (
            'Register payment'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReceivablesInvoiceRegisterPayForm;
