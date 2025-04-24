'use client';
import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import { Button } from '@/core/components/ui/button';
import { revalidateServerTags } from '@/core/lib/cache';
import { paths } from '@/core/lib/routes';
import { getApiErrorMessage } from '@/server/exceptions/error-codes';
import { createNewExpense, updateExpense } from '@/server/services/expenses';
import { Expense, NewExpenseDTO } from '@/server/types/expenses';
import { zodResolver } from '@hookform/resolvers/zod';
import { getYear } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import NewExpenseForm from '../components/form/NewExpenseForm';
import { expenseSchema } from '../libs/schemas';

type ExpenseFormContainerProps = {
  expense?: Expense;
};

const NewExpenseFormContainer: FC<ExpenseFormContainerProps> = ({
  expense,
}) => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!expense;

  const formOptions: UseFormProps<NewExpenseDTO> = {
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? { ...expense }
      : {
          total_deduction: 0,
        },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<NewExpenseDTO>(formOptions);

  const onSubmit = async (data: NewExpenseDTO) => {
    setLoading(true);
    try {
      const isNewFile = (file: File) => {
        return !expense?.files.some(
          (existingFile) => existingFile.name === file.name,
        );
      };

      const formData = new FormData();

      if (isEditing) {
        const deletedFiles = expense.files.filter(
          (existingFile) =>
            !data.files.some((newFile) => newFile.name === existingFile.name),
        );

        deletedFiles.forEach((file) => {
          formData.append(
            'delete_files',
            String((file as unknown as { id: number }).id),
          );
        });
      }

      const newFiles = data.files.filter(isNewFile);
      if (newFiles.length > 0) {
        newFiles.forEach((file) => formData.append('files', file));
      }

      formData.append('month', String(data.month));
      formData.append('production_id', String(data.production_id));
      formData.append('year', String(getYear(new Date())));
      formData.append('total_deduction', String(data.total_deduction));

      const res = isEditing
        ? await updateExpense(formData, String(expense?.id.toString()))
        : await createNewExpense(formData);

      if (!res.success) {
        const errorFallback = isEditing ? 'Error updating expense' : 'Error creating expense';
        toast.error(
         getApiErrorMessage(errorFallback, res.error)
        );
      } else {
        toast.success(isEditing ? 'Expense updated' : 'Expense created');
        await revalidateServerTags('expenses-list');
        await revalidateServerTags('payable-bills');
        await revalidateServerTags('payable-production-bills');
        await revalidateServerTags('payable-production-flights');
        push(paths.expenses.root);
      }
    } catch (e) {
      console.log(e);
      toast.error(
        isEditing ? 'Error updating expense' : 'Error creating expense',
      );
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
    push(paths.expenses.root);
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
        <h3 className="text-xl font-semibold">
          {isEditing ? 'Edit expense' : 'New expense'}
        </h3>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <NewExpenseForm {...{ loading, onClose: handleOnBack, isEditing }} />
        </form>
      </FormProvider>

      <AlertModal
        {...{
          open,
          onClose: () => setOpen(false),
          onConfirm: () => {
            push(paths.expenses.root);
            setOpen(false);
          },
          title: isEditing ? 'Discard changes' : 'Cancel expense creation',
          description: isEditing
            ? 'If you discard the form, all changes will not be saved. Are you sure you want to continue?'
            : 'If you cancel the form, all changes will not be saved. Are you sure you want to continue?',
        }}
      />
    </div>
  );
};

export default NewExpenseFormContainer;
