'use client';
import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { Button } from '@/core/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type NewPayerProps = {
  loading: boolean;
  onClose: () => void;
  isEdit?: boolean;
};

const PayerForm: FunctionComponent<NewPayerProps> = ({
  loading,
  onClose,
  isEdit,
}) => {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow p-6 rounded-lg">
        <RHFTextField
          name="entity_name"
          label="Entity name"
          required
          placeholder="E.g: John Smith"
        />
        <RHFTextField
          name="entity_address"
          label="Entity address"
          placeholder="E.g: 14th Street"
        />
        <RHFTextField
          name="contact_name"
          label="Contact name"
          required
          placeholder="E.g: John Smith"
        />
        <RHFTextField
          name="contact_phone_number"
          label="Contact phone number"
          required
          placeholder="E.g: 123456789"
        />
        <RHFTextField
          name="contact_email"
          label="Contact email"
          required
          placeholder="E.g: john@acme.com"
        />
        <RHFTextField
          name="payment_terms"
          label="Payment Terms(Days)"
          required
          type="number"
          placeholder="E.g: 30"
        />
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          onClick={onClose}
          variant={'outline'}
          type="button"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isValidForm || loading}>
          {isEdit ? 'Edit payer' : 'Create payer'}
          {loading && (
            <LoaderCircle className="animate-spin w-4 h-4 text-secondary" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PayerForm;
