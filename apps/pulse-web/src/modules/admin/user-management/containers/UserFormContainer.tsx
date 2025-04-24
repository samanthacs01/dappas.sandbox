'use client';
import { Button } from '@/core/components/ui/button';
import { revalidateServerTags } from '@/core/lib/cache';
import { createUser, updateUser } from '@/server/services/users';
import { User, UserDTO } from '@/server/types/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { toast } from 'sonner';
import UserManagementForm from '../components/forms/UserManagementForm';
import CancelUserModal from '../components/user-table/CancelUserModal';
import { userSchema } from '../libs/schema';

type UserFormContainerProps = {
  isEditing: boolean;
  user: User | undefined;
};

const UserFormContainer: FC<UserFormContainerProps> = ({ isEditing, user }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const formOptions: UseFormProps<UserDTO> = {
    resolver: zodResolver(userSchema),
    defaultValues: user ?? {
      email: '',
      first_name: '',
      last_name: '',
      role: 'admin',
      status: true,
    },
    mode: 'onBlur' as const,
    reValidateMode: 'onChange' as const,
  };

  const methods = useForm<UserDTO>(formOptions);

  const onSubmit = async (data: UserDTO) => {
    setLoading(true);
    try {
      const res =
        isEditing && user
          ? await updateUser(user?.id.toString(), data)
          : await createUser(data);
      if (!res) {
        toast.error(isEditing ? 'Error updating user' : 'Error creating user');
        setLoading(false);
        return;
      }
      toast.success(
        isEditing ? 'User updated successfully' : 'User created successfully',
      );
      await revalidateServerTags('users');
      router.push('/user-management');
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast.error(isEditing ? 'Error updating user' : 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const isDirty = () => methods.formState.isDirty;

  const handleOnCancel = () => {
    if (isDirty()) {
      setOpen(true);
      return;
    }
    methods.reset();
    router.back();
  };

  return (
    <div className="w-full h-full p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <Button
          className="h-7 w-7 px-0 shadow-sm border"
          variant="ghost"
          onClick={handleOnCancel}
        >
          <ChevronLeft width={16} height={16} />
        </Button>
        <h3 className="text-xl font-semibold">
          {isEditing ? 'Edit user' : 'New user'}
        </h3>
      </div>
      <FormProvider {...methods}>
        <form
          action={'#'}
          autoComplete="off"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <UserManagementForm
            {...{ onCancel: handleOnCancel, loading, isEditing }}
          />
        </form>
      </FormProvider>
      <CancelUserModal
        {...{
          open,
          onConfirm: () => {
            setOpen(false);
            methods.reset();
            router.back();
          },
          onCancel: () => setOpen(false),
          isEditing,
        }}
      />
    </div>
  );
};

export default UserFormContainer;
