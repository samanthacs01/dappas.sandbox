import { getUsers } from '@/server/services/users';
import { SearchParams } from '@/server/types/params';
import React, { FunctionComponent } from 'react';
import UserManagementTable from '../components/user-table/UserManagementTable';

type UserManagementTableContainerProps = {
  searchParams: SearchParams;
};

const UserManagementTableContainer: FunctionComponent<
  UserManagementTableContainerProps
> = async ({ searchParams }) => {
  const { items, pagination } = await getUsers(searchParams);

  const data = Array.isArray(items) ? items : [];

  return <UserManagementTable {...{ data, pagination }} />;
};

export default UserManagementTableContainer;
