'use client';

import AlertModal from '@/core/components/common/alert-modal/alert-modal';
import { Button } from '@/core/components/ui/button';
import { revalidateServerTags } from '@/core/lib/cache';
import { paths } from '@/core/lib/routes';
import { parseDynamicEditToFormData } from '@/modules/admin/payable/libs/utils/parsers';
import { productionsSchema } from '@/modules/admin/payable/libs/utils/schema';
import {
  createPayableProduction,
  updatePayableProduction,
} from '@/server/services/payable';
import {
  CreateProductionDto,
  PayableProductionDto,
} from '@/server/types/payable';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ProductionForm from './ProductionForm';

type NewProductionProps = {
  isEditing?: boolean;
  production?: PayableProductionDto;
};

const ProductionFormContainer: FunctionComponent<NewProductionProps> = ({
  isEditing,
  production,
}) => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateProductionDto>({
    defaultValues: production ?? {
      contact_email: '',
      contact_name: '',
      contact_phone_number: '',
      contract_file: undefined,
      entity_address: '',
      entity_name: '',
      net_payment_terms: 0,
      production_billing_type: 'billing',
      production_expense_recoupment_type: 'before',
      production_split: 0,
    },
    resolver: zodResolver(productionsSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: CreateProductionDto) => {
    setLoading(true);

    if (
      !data.contract_file ||
      (Array.isArray(data.contract_file) && !data.contract_file.length)
    ) {
      toast.error('Please upload a contract file');
      setLoading(false);
      return;
    }
    let formData = new FormData();

    if (isEditing && production) {
      formData = parseDynamicEditToFormData(data);
      if (data.contract_file instanceof File) {
        formData.set('contract_file', data.contract_file);
      } else {
        formData.delete('contract_file');
      }
    } else {
      formData = parseDynamicEditToFormData(data);
    }

    const res =
      isEditing && production
        ? await updatePayableProduction(formData, production?.id.toString())
        : await createPayableProduction(formData);

    if (!res.success) {
      toast.error(
        isEditing
          ? 'Error updating payable productions'
          : 'Error creating payable productions',
      );
    } else {
      toast.success(
        isEditing
          ? 'Production updated successfully'
          : 'Production created successfully',
      );
      await revalidateServerTags('payable-productions');
      push(paths.payable.productions.root);
    }

    setLoading(false);
  };

  const handleOnBack = () => {
    if (form.formState.isDirty) {
      setOpen(true);
      return;
    }
    push(paths.payable.productions.root);
    form.reset();
  };

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
          {isEditing ? 'Production edition' : 'New production'}
        </h3>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductionForm
            onClose={handleOnBack}
            loading={loading}
            isEditing={isEditing}
          />
        </form>
      </FormProvider>

      <AlertModal
        {...{
          open,
          onClose: () => setOpen(false),
          onConfirm: () => push(paths.payable.productions.root),
          title: isEditing
            ? 'Discard changes'
            : 'Cancel new production creation',
          description: isEditing
            ? 'If you discard the form, all changes will not be saved. Are you sure you want to continue?'
            : 'If you cancel the form, all changes will not be saved. Are you sure you want to continue?',
        }}
      />
    </div>
  );
};

export default ProductionFormContainer;
