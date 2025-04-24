'use client';
import { revalidateServerTags } from '@/core/lib/cache';
import { registerBillPayment } from '@/server/services/payable';
import {
  PayableBills,
  PayableBillsRegisterPayment,
} from '@/server/types/payable';
import { zodResolver } from '@hookform/resolvers/zod';
import { FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { registerBillsPaymentSchema } from './libs/schemas';
import RegisterBillsPaymentForm from './RegisterBillsPaymentForm';

type RegisterBillProps = {
  onClose: () => void;
  bill_id: string | null;
};

const RegisterBillsPaymentFormContainer: FunctionComponent<
  RegisterBillProps
> = ({ onClose, bill_id }) => {
  const [bills, setBills] = useState<PayableBills | null>(null);
  const [loading, setLoading] = useState(false);

  const formOptions: UseFormProps<PayableBillsRegisterPayment> = {
    resolver: zodResolver(registerBillsPaymentSchema(bills?.balance || 0)),
    defaultValues: {
      amount: 0,
    },
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
  };
  const methods = useForm<PayableBillsRegisterPayment>(formOptions);
  const onSubmit = async (data: PayableBillsRegisterPayment) => {
    setLoading(true);
    try {
      if (!bill_id) {
        toast.error('Provide a bill id');
        setLoading(false);
        return;
      }
      const res = await registerBillPayment(bill_id, data);
      if (!res.success) {
        toast.error('Error registering payment');
        setLoading(false);
        return;
      }
      toast.success('Payment registered successfully');
      await revalidateServerTags('payable-bills');
      await revalidateServerTags('payable-production-flights');
      await revalidateServerTags('payable-production-bills');
      handleOnClose();
    } catch (error) {
      console.log(error);
      toast.error('Error registering payment');
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    methods.reset();
    onClose();
    localStorage.removeItem('local_bills');
  };

  useEffect(() => {
    const localBills = localStorage.getItem('local_bills');
    if (localBills) {
      setBills(JSON.parse(localBills));
    }
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        action={'#'}
        autoComplete="off"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <RegisterBillsPaymentForm
          {...{ bills, loading, onClose: handleOnClose }}
        />
      </form>
    </FormProvider>
  );
};

export default RegisterBillsPaymentFormContainer;
