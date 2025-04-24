'use client';

import { paths } from '@/core/lib/routes';
import { requestRecoverPassword } from '@/server/services/auth';
import { RecoverPassword } from '@/server/types/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { RecoverPasswordForm } from '../components/RecoverPasswordForm';
import { recoverPasswordSchema } from '../utils/recoverPasswordSchema';

export const RecoverPasswordFormContainer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formOptions: UseFormProps<RecoverPassword> = {
    resolver: zodResolver(recoverPasswordSchema()),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<RecoverPassword>(formOptions);

  const router = useRouter();

  const onSubmit = async (data: RecoverPassword) => {
    setIsLoading(true);

    const { email } = data;
    const response = await requestRecoverPassword({ email });
    
    if (!response.success) {
      toast.error('An error has occurred', {
        description: 'Please review your data and try again',
      });
    } else {
      router.push(paths.security.link_sent);
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
        >
          <RecoverPasswordForm isLoading={isLoading} />
        </form>
      </FormProvider>
    </div>
  );
};
