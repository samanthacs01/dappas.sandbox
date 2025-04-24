'use client';
import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import { Button } from '@/core/components/ui/button';
import { paths } from '@/core/lib/routes';
import NewExpenseForm from '@/modules/admin/expenses/components/form/NewExpenseForm';
import { expenseSchema } from '@/modules/admin/expenses/libs/schemas';
import { createNewExpense } from '@/server/services/expenses';
import { NewExpenseDTO } from '@/server/types/expenses';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';

type RegisterExpenseProps = {
  production_id: number;
};

const RegisterExpenseFormContainer: FunctionComponent<RegisterExpenseProps> = ({
  production_id,
}) => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const formOptions: UseFormProps<NewExpenseDTO> = {
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      production_id: Number(production_id),
      total_deduction: 0,
      files: [],
    },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<NewExpenseDTO>(formOptions);

  const onSubmit = async (data: NewExpenseDTO) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('files', data.files[0]);
      formData.append('month', String(data.month));
      formData.append('production_id', String(data.production_id));
      formData.append('total_deduction', String(data.total_deduction));

      const res = await createNewExpense(formData);

      if (!res.success) {
        toast.error('Error registering expense');
      } else {
        toast.success('Expense registered successfully');
        push(paths.payable.productions.root);
      }
    } catch (e) {
      console.log(e);
      toast.error('Error registering expense');
    } finally {
      setLoading(false);
    }
  };

  const isDirty = () => methods.formState.isDirty;

  const handleOnBack = () => {
    if (isDirty()) {
      setOpen(true);
      return;
    }
    push(paths.payable.productions.root);
    methods.reset();
  };

  useEffect(() => {
    isDirty();
  }, [methods.formState.isDirty]);

  return (
    <div className="w-full h-full p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <Button
          className="h-[28px] w-[28px] shadow"
          variant="ghost"
          onClick={handleOnBack}
        >
          <ChevronLeft />
        </Button>
        <h3 className="text-xl font-semibold">Register expense</h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <NewExpenseForm loading={loading} onClose={handleOnBack} isRegister />
        </form>
      </FormProvider>

      <AlertModal
        {...{
          open,
          onClose: () => setOpen(false),
          onConfirm: () => push(paths.payable.productions.root),
          title: 'Cancel expense registration',
          description:
            'If you cancel the form, all changes will not be saved. Are you sure you want to continue?',
        }}
      />
    </div>
  );
};

export default RegisterExpenseFormContainer;
