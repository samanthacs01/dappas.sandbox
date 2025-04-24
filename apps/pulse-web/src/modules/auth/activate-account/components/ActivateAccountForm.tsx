import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import { FunctionComponent, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type ActivateAccountFormProps = {
  isLoading: boolean;
};

export const ActivateAccountForm: FunctionComponent<
  ActivateAccountFormProps
> = ({ isLoading }) => {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-base">New account</CardTitle>
        <CardDescription className="text-sm">
          Enter the new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <RHFTextField
              label="New password"
              name="password"
              required
              type="password"
              placeholder="Enter the new password"
              data-cy="activate-account-password-input"
            />
            <RHFTextField
              label="Repeat password"
              name="repeatPassword"
              required
              type="password"
              placeholder="Repeat the new password"
              data-cy="activate-account-repeat-password-input"
            />
          </div>
          <div className="flex w-full justify-between">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isValidForm}
              data-cy="activate-account-submit-button"
            >
              Set password
              {isLoading && (
                <LoaderCircle className="animate-spin w-4 h-4 text-secondary" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
