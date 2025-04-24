'use client';

import RHFSelect from '@/core/components/common/form-inputs/rhf-select';
import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import RHFUploadButton from '@/core/components/common/form-inputs/rhf-upload-button';
import { Button } from '@/core/components/ui/button';
import { Loader2 } from 'lucide-react';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  onClose: () => void;
  loading: boolean;
  isEditing?: boolean;
};

const ProductionForm: FunctionComponent<Props> = ({
  loading,
  onClose,
  isEditing,
}) => {
  const { formState, setValue } = useFormContext();
  const isValidForm = useMemo(
    () => formState.isDirty && formState.isValid,
    [formState.isDirty, formState.isValid],
  );

  const onContractDrop = useCallback((acceptedFiles: File[]) => {
    setValue('contract_file', acceptedFiles, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow p-6 rounded-lg">
        <RHFTextField
          name="entity_name"
          label={'Entity name'}
          required
          placeholder="E.g: John Smith"
        />
        <RHFTextField
          name="entity_address"
          label={'Entity address'}
          placeholder="E.g: 14th Street"
        />
        <RHFTextField
          name="contact_name"
          label={'Contact name'}
          required
          placeholder="E.g: John Smith"
        />
        <RHFTextField
          name="contact_phone_number"
          label={'Contact phone number'}
          placeholder="E.g: 123456789"
          required
        />

        <RHFTextField
          name="contact_email"
          label={'Contact email'}
          type="email"
          disabled={isEditing}
          required
          placeholder="E.g: john@acme.com"
        />
        <RHFTextField
          name="production_split"
          label={'Production split(%)'}
          placeholder="E.g: 10"
          type="number"
          required
        />
        <RHFSelect
          name={'production_billing_type'}
          label="Payment type"
          placeholder="Select payment type"
          required
          options={[
            { label: 'Billing', value: 'billing' },
            { label: 'Collection', value: 'collection' },
          ]}
        />
        <RHFTextField
          name="net_payment_terms"
          label={'Net payment terms (Days)'}
          placeholder="E.g: 10"
          type="number"
          required
        />

        <RHFSelect
          name={'production_expense_recoupment_type'}
          label="Expense recoupment"
          placeholder="Select expense recoupment"
          required
          options={[
            { value: 'before', label: 'Before Split' },
            { value: 'after', label: 'After Split' },
          ]}
        />
        <div className="col-span-2">
          <RHFUploadButton
            name="contract_file"
            label="Contract"
            required
            multiple={false}
            accept={{
              'application/pdf': ['.pdf'],
            }}
            onDrop={onContractDrop}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          {isEditing ? 'Discard' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={loading || !isValidForm}>
          {loading ? (
            <span className="flex gap-1 w-24 justify-center">
              <Loader2 className="animate-spin" />
            </span>
          ) : isEditing ? (
            'Save changes'
          ) : (
            'Create production'
          )}
        </Button>
      </div>
    </>
  );
};

export default ProductionForm;
