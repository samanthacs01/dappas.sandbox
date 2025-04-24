'use client';

import { paths } from '@/core/lib/routes';
import { setNewPassword } from '@/server/services/auth';
import { SetPassword, SetPasswordDTO } from '@/server/types/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { setPasswordSchema } from '../../reset-password/utils/setPasswordSchema';
import { ActivateAccountForm } from '../components/ActivateAccountForm';

type Props = {
  searchParams: {
    token: string;
  };
};
export const ActivateAccountContainer: FunctionComponent<Props> = ({
  searchParams,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { token } = searchParams;

  const formOptions: UseFormProps<SetPassword> = {
    resolver: zodResolver(setPasswordSchema()),
    defaultValues: {
      password: '',
      repeatPassword: '',
      token: '',
    },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<SetPassword>(formOptions);

  const router = useRouter();

  const onSubmit = async (data: SetPassword) => {
    setIsLoading(true);

    const dataParse: SetPasswordDTO = {
      password: data.password,
      token: token,
    };
    const res = await setNewPassword(dataParse);
  
    if (!res.success) {
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
          <ActivateAccountForm isLoading={isLoading} />
        </form>
      </FormProvider>
    </div>
  );
};
