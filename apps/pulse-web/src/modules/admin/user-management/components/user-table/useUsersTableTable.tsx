'use client';

import { TableColumnHeader } from '@/core/components/common/table/table-column-header';
import useUrlParams from '@/core/hooks/use-url-params';
import { User } from '@/server/types/users';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { renderUserRole, renderUserStatus } from '../../libs/renders';
import UserTableActions from './UserTableActions';

const useUsersTableTable = () => {
  const { push } = useRouter();
  const { updateSearchParams } = useUrlParams();

  const handleOnDelete = async (id: string) => {
    updateSearchParams({
      currentModal: { action: 'set', value: 'delete-user' },
      userId: { action: 'set', value: id },
    });
  };

  const handleOnSendEmail = async (id: string) => {
    updateSearchParams({
      currentModal: { action: 'set', value: 'send-email' },
      userId: { action: 'set', value: id },
    });
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'first_name',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="First name" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('first_name')}</div>
      ),
    },
    {
      accessorKey: 'last_name',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Last name" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{row.getValue('last_name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Email" />;
      },
      cell: ({ row }) => <div className="px-4">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Role" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{renderUserRole(row.getValue('role'))}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return <TableColumnHeader column={column} label="Status" />;
      },
      cell: ({ row }) => (
        <div className="px-4">{renderUserStatus(row.getValue('status'))}</div>
      ),
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <UserTableActions
          onEdit={() => push(`/user-management/edit-user/${row.original.id}`)}
          onRemove={() => handleOnDelete(row.original.id)}
          onSendEmail={() => handleOnSendEmail(row.original.id)}
          status={row.getValue('status')}
        />
      ),
    },
  ];

  return { columns };
};

export default useUsersTableTable;
