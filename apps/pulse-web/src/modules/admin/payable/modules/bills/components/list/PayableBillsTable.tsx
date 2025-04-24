'use client';

import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { PayableBills } from '@/server/types/payable';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import RegisterPaymentModalContainer from '../../../../containers/RegisterPaymentModalContainer';
import useBillsTable from './hooks/useBillsTable';
import PayableBillsFilters from './PayableBillsFilters';

type BillsTableProps = {
  data: PayableBills[];
  pagination: Pagination;
};

const PayableBillsTable: FunctionComponent<BillsTableProps> = ({
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
  const { columns } = useBillsTable();

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
      <PayableBillsFilters />
      <Table columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
      <RegisterPaymentModalContainer />
    </div>
  );
};

export default PayableBillsTable;
