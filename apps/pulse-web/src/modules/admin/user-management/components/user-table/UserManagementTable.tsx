'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { User } from '@/server/types/users';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { DeleteUserModal } from './DeleteUserModal';
import { ResendEmailModal } from './ResendEmailModal';
import UserManagementTableFilters from './UserManagementTableFilters';
import useUsersTableTable from './useUsersTableTable';

type UsersTableProps = {
  data: User[];
  pagination: Pagination;
};

const UserManagementTable: FunctionComponent<UsersTableProps> = ({
  data,
  pagination,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { columns } = useUsersTableTable();

  const handleSortingChange = useTableSorting({ sorting, setSorting });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      <UserManagementTableFilters />
      <div className="overflow-x-auto max-w-full space-y-4">
        <Table<User> columns={columns} table={table} className="min-w-fit" />
        <TablePaginationFooter pagination={pagination} />
      </div>
      <DeleteUserModal />
      <ResendEmailModal />
    </div>
  );
};

export default UserManagementTable;
