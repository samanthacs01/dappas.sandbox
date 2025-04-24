import { revalidateServerTags } from '@/core/lib/cache';
import { invoicesPayment } from '@/server/services/receivables';
import {
  ReceivableInvoicePayment,
  ReceivablesInvoices,
} from '@/server/types/receivables';
import { zodResolver } from '@hookform/resolvers/zod';
import { FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { registerPayFormSchema } from '../../../utils/schemas';
import ReceivablesInvoiceRegisterPayForm from '../components/ReceivablesInvoiceRegisterPayForm';

type FormContainerProps = {
  onClose: () => void;
  invoiceId: string;
};

const ReceivablesInvoiceRegisterPayFormContainer: FunctionComponent<
  FormContainerProps
> = ({ onClose, invoiceId }) => {
  const [loading, setLoading] = useState(false);
  const [receivableInvoice, setReceivableInvoice] =
    useState<ReceivablesInvoices | null>(null);

  const formOptions: UseFormProps<ReceivableInvoicePayment> = {
    resolver: zodResolver(
      registerPayFormSchema(receivableInvoice?.balance ?? 0),
    ),
    defaultValues: { payment_amount: 0 },
    mode: 'onChange' as const,
  };

  const methods = useForm<ReceivableInvoicePayment>(formOptions);

  const onSubmit = async (data: ReceivableInvoicePayment) => {
    setLoading(true);
    try {
      const { success } = await invoicesPayment(invoiceId, data.payment_amount);
      if (!success) {
        toast.error('Error registering the payment');
        setLoading(false);
        return;
      }
      
      toast.success('Payment registered successfully');
      await revalidateServerTags('invoices');
      handleOnClose();
    } catch (error) {
      toast.error('Error registering the payment');
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    methods.reset();
    localStorage.removeItem('local-invoice');
    onClose();
  };

  useEffect(() => {
    if (invoiceId) {
      const invoice = JSON.parse(localStorage.getItem('local-invoice') || '');
      setReceivableInvoice(invoice);
    }
  }, [invoiceId]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} autoComplete="off">
        {receivableInvoice ? (
          <ReceivablesInvoiceRegisterPayForm
            {...{ onClose: handleOnClose, loading, receivableInvoice }}
          />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <h3 className="font-bold text-xl">No invoice found</h3>
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default ReceivablesInvoiceRegisterPayFormContainer;
