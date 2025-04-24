'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Expenses } from '@/server/types/expenses';
import { Pagination } from '@/server/types/pagination';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import { DeleteExpenseAlert } from './DeleteExpenseAlert';
import ExpensesTableFilters from './ExpensesTableFilters';
import useExpensesTable from './useExpensesTable';

type ExpensesTableProps = {
  data: Expenses[];
  pagination: Pagination;
};

const ExpensesTable: FunctionComponent<ExpensesTableProps> = ({
  data,
  pagination,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { columns } = useExpensesTable();

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
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <ExpensesTableFilters />
      </div>
      <Table columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
      <DeleteExpenseAlert />
    </div>
  );
};

export default ExpensesTable;
