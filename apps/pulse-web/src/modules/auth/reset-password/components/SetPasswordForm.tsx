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

type SetPasswordFormProps = {
  isLoading: boolean;
};

export const SetPasswordForm: FunctionComponent<SetPasswordFormProps> = ({
  isLoading,
}) => {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-base">Account recovery</CardTitle>
        <CardDescription className="text-sm">
          Enter the new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4">
            <RHFTextField
              label="Password"
              name="password"
              required
              type="password"
              placeholder="Enter the new password"
              data-cy="rest-password-input"
            />
            <RHFTextField
              label="Repeat password"
              name="repeatPassword"
              required
              type="password"
              placeholder="Repeat the new password"
              data-cy="rest-password-repeat-input"
            />
          </div>
          <div className="flex w-full justify-between">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isValidForm}
              data-cy="rest-password-button-submit"
            >
              Recover account
              {isLoading && (
                <LoaderCircle className="animate-spin w-4 h-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
