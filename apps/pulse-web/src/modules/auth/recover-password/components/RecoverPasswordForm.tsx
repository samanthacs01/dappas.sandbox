import RHFTextField from '@/core/components/common/form-inputs/rhf-text-field';
import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { paths } from '@/core/lib/routes';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent, useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type RecoverPasswordFormProps = {
  isLoading: boolean;
};

export const RecoverPasswordForm: FunctionComponent<
  RecoverPasswordFormProps
> = ({ isLoading }) => {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-base">Account recovery</CardTitle>
        <CardDescription className="text-sm">
          Provide us the account user. We will send you a recovery link to your
          email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <RHFTextField
              label="Email"
              name="email"
              required
              placeholder="user@domain.com"
              data-cy="recover-password-email-input"
            />
          </div>
          <div className="flex w-full justify-between">
            <Link
              href={paths.security.login}
              prefetch={false}
              data-cy="back-to-login-link"
            >
              <Button variant="outline" type="button">
                Back to login
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || !isValidForm}
              data-cy="recover-password-continue-button"
            >
              Continue
              {isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
