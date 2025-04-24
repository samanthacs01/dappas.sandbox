'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { InsertionOrder } from '@/server/types/booking';
import { Pagination } from '@/server/types/pagination';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import InsertionOrdersTableFilter from './InsertionOrdersTableFilter';
import useInsertionOrdersTable from './useInsertionOrdersTable';

type InsertionOrdersTableProps = {
  data: InsertionOrder[];
  pagination: Pagination;
};

const InsertionOrdersTable: FunctionComponent<InsertionOrdersTableProps> = ({
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
  const { columns } = useInsertionOrdersTable();

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
      <div className="flex justify-between">
        <InsertionOrdersTableFilter />
      </div>
      <Table columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
    </div>
  );
};

export default InsertionOrdersTable;
