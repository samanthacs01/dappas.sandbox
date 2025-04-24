'use client';
import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import { Button } from '@/core/components/ui/button';
import { revalidateServerTags } from '@/core/lib/cache';
import { paths } from '@/core/lib/routes';
import {
  createReceivablePayer,
  editReceivablePayer,
} from '@/server/services/receivables';
import {
  NewReceivablePayer,
  ReceivablePayers,
} from '@/server/types/receivables';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { createNewPayerSchema } from '../../../utils/schemas';
import PayerForm from '../components/new-payer/PayerForm';


type ReceivableNewPayerFormContainerProps = {
  payerDetails?: ReceivablePayers;
};

const ReceivableNewPayerFormContainer: FC<
  ReceivableNewPayerFormContainerProps
> = ({ payerDetails }) => {
  const [open, setOpen] = useState(false);
  const { back, push } = useRouter();
  const [loading, setLoading] = useState(false);

  const isEdit = useMemo(() => !!payerDetails, [payerDetails]);

  const formOptions: UseFormProps<NewReceivablePayer> = {
    resolver: zodResolver(createNewPayerSchema),
    defaultValues: payerDetails ?? {
      contact_email: '',
      contact_name: '',
      contact_phone_number: '',
      entity_address: '',
      entity_name: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  };

  const methods = useForm<NewReceivablePayer>(formOptions);

  const onSubmit = async (data: NewReceivablePayer) => {
    setLoading(true);

    if (isEdit && payerDetails) {
      const response = await editReceivablePayer({
        ...payerDetails,
        ...data,
        id: payerDetails.id,
      });
      if (!response.success) {
        toast.error('Failed to edit payer');
      } else {
        toast.success('Payer edit successfully');
      }
    } else {
      const response = await createReceivablePayer(data);
      if (!response.success) {
        toast.error('Failed to create payer');
      } else {
        toast.success('Payer created successfully');
      }
    }

    await revalidateServerTags('receivables-payers');
    push(paths.receivable.payers.root);
    setLoading(false);
  };
  const isDirty = () => methods.formState.isDirty;

  const handleOnBack = () => {
    if (isDirty()) {
      setOpen(true);
      return;
    }
    back();
    methods.reset();
  };

  useEffect(() => {
    isDirty();
  }, [methods.formState.isDirty]);

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Button
              className="h-[28px] w-[28px] shadow"
              variant="ghost"
              onClick={handleOnBack}
            >
              <ChevronLeft />
            </Button>
            <h3 className="text-xl font-semibold">
              {isEdit ? 'Edit payer' : 'New payer'}
            </h3>
          </div>
          <form
            autoComplete="off"
            action="#"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <PayerForm {...{ loading, onClose: handleOnBack, isEdit }} />
          </form>
        </div>
      </FormProvider>
      <AlertModal
        {...{
          open,
          onClose: () => setOpen(false),
          onConfirm: () => push('/receivables/payers'),
          title: isEdit ? 'Cancel payer edition' : 'Cancel new payer creation',
          description:
            'If you cancel the form, all changes will not be saved. Are you sure you want to continue?',
        }}
      />
    </>
  );
};

export default ReceivableNewPayerFormContainer;
