import RHFSelect from '@/core/components/common/form-inputs/rhf-select';
import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { Button } from '@/core/components/ui/button';
import { userRoles } from '@/server/services/__mock/users';
import { Loader2 } from 'lucide-react';
import { FC, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type UserFormProps = {
  loading?: boolean;
  onCancel: () => void;
  isEditing?: boolean;
};

const UserManagementForm: FC<UserFormProps> = ({
  onCancel,
  loading,
  isEditing,
}) => {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm border p-6 rounded-lg  bg-card">
        <RHFTextField
          name="first_name"
          label="First name"
          required
          placeholder="E.g: John"
        />
        <RHFTextField
          name="last_name"
          label="Last name"
          required
          placeholder="E.g: Smith"
        />
        <RHFTextField
          name="email"
          label="Email"
          required
          placeholder="E.g: 2E2Xt@example.com"
          type="email"
          disabled={isEditing}
        />
        <RHFSelect
          name="role"
          options={userRoles}
          label="Role"
          placeholder="Select the role"
          disabled
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant={'outline'}
          onClick={onCancel}
          disabled={loading}
          type="button"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !isValidForm}>
          {loading ? (
            <span className="flex gap-1 w-24 justify-center">
              <Loader2 className="animate-spin" />
            </span>
          ) : isEditing ? (
            'Save changes'
          ) : (
            'Create user'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserManagementForm;
