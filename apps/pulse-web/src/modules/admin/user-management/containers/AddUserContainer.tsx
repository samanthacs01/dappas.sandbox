import { getUser } from '@/server/services/users';
import { User } from '@/server/types/users';
import { FC } from 'react';
import UserFormContainer from './UserFormContainer';

type UserManagementProps = {
  id?: string;
};

const AddUserContainer: FC<UserManagementProps> = async ({ id }) => {
  let user: User | undefined = undefined;

  if (id) {
    try {
      const response = await getUser(id);
      if (!response.success || !response.data) {
        throw new Error('Error fetching user');
      }
      user = response.data;
    } catch (error) {
      console.error('Error fetching payable production:', error);
    }
  }

  const isEditing = !!id;
  return <UserFormContainer {...{ isEditing, user }} />;
};

export default AddUserContainer;
