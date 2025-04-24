'use client';

import { paths } from '@/core/lib/routes';
import { setNewPassword } from '@/server/services/auth';
import { SetPassword } from '@/server/types/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { SetPasswordForm } from '../components/SetPasswordForm';
import { setPasswordSchema } from '../utils/setPasswordSchema';

type Props = {
  token: string;
};

export const SetPasswordContainer: FunctionComponent<Props> = ({ token }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formOptions: UseFormProps<SetPassword> = {
    resolver: zodResolver(setPasswordSchema()),
    defaultValues: {
      password: '',
      repeatPassword: '',
    },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<SetPassword>(formOptions);

  const router = useRouter();

  const onSubmit = async (data: SetPassword) => {
    setIsLoading(true);

    const response = await setNewPassword({ password: data.password, token });

    if (!response.success) {
      toast.error('An error has occurred', {
        description: 'Please review your data and try again',
      });
    } else {
      toast.success('Password changed successfully', {
        description: 'Now you can log in on the system',
      });
      router.push(paths.security.login);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <FormProvider {...methods}>
        <form
          action="#"
          onSubmit={methods.handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full"
        >
          <SetPasswordForm isLoading={isLoading} />
        </form>
      </FormProvider>
    </div>
  );
};
