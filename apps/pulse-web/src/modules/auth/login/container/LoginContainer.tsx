'use client';

import { paths } from '@/core/lib/routes';
import { UserLogin } from '@/server/types/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlert } from 'lucide-react';
import { getSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import { LoginForm } from '../components/LoginForm';
import { loginSchemas } from '../utils/loginSchemas';
import { addFromToUrl } from '@/core/lib/request';

export const LoginContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const checkSession = async () => {
    const session = await getSession();
    if (session?.user) {
      await signOut({ redirect: false });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const formOptions: UseFormProps<UserLogin> = {
    resolver: zodResolver(loginSchemas()),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange' as const,
  };
  const methods = useForm<UserLogin>(formOptions);

  const onSubmit = async (data: UserLogin) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.status === 401) {
        toast('Login failed', {
          description: 'Invalid username or password',
          icon: <OctagonAlert className="pr-1" />,
        });
      } else if (res?.status === 200) {
        push(addFromToUrl(paths.overview));
        toast.success('Login successful');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 relative">
      <FormProvider {...methods}>
        <form
          action="#"
          onSubmit={methods.handleSubmit(onSubmit)}
          autoComplete="off"
          className="relative z-10"
        >
          <LoginForm loading={isLoading} />
        </form>
      </FormProvider>
    </div>
  );
};
