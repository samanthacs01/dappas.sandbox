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
import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';

type Props = {
  loading: boolean;
};

export function LoginForm({ loading }: Props) {
  const { isValid, isDirty } = useFormState();
  const isValidForm = useMemo(() => isValid && isDirty, [isValid, isDirty]);
  return (
    <Card className="mx-auto max-w-sm z-10 ">
      <CardHeader className="pt-6">
        <CardTitle className="text-2xl pr-4">
          Welcome to Our Management System!
        </CardTitle>
        <CardDescription className="pt-2 pr-4">
          To provide you with a secure and seamless experience, please sign in
          to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <RHFTextField
              id="email"
              type="email"
              placeholder="user@domain.com"
              required
              name={'email'}
              label={'Email'}
              data-cy="login-email-input"
            />
          </div>
          <div className="grid gap-2">
            <RHFTextField
              id="password"
              type="password"
              required
              placeholder="Enter your account password"
              name={'password'}
              label={'Password'}
              data-cy="login-password-input"
            />
          </div>
          <div className="grid gap-2 justify-end">
            <Link
              href={paths.security.recover_password}
              className="ml-auto text-blue-500 hover:text-blue-700 inline-block text-sm underline"
              data-cy="login-forgot-password-link"
            >
              Forgot your password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !isValidForm}
            data-cy="login-submit-button"
          >
            Sign in
            {loading && (
              <LoaderCircle className="animate-spin w-4 h-4 text-secondary" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
