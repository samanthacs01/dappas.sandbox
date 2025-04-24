'use client';
import { Table } from '@/core/components/common/table';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Expenses } from '@/server/types/expenses';
import { Pagination } from '@/server/types/pagination';
import {
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import ProductionExpensesTableFilter from './ProductionExpensesTableFilter';
import useProductionExpensesTable from './useProductionExpensesTable';

type ProductionExpensesTableProps = {
  data: Expenses[];
  pagination: Pagination;
};

export const ProductionExpensesTable: FunctionComponent<
  ProductionExpensesTableProps
> = ({ data, pagination }) => {
  const { columns } = useProductionExpensesTable();
  const [sorting, setSorting] = useState<SortingState>([]);
  const handleSortingChange = useTableSorting({ sorting, setSorting });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <ProductionExpensesTableFilter />
      <ScrollArea className="w-full max-h-min">
        <Table<Expenses> columns={columns} table={table} />
      </ScrollArea>
      <TablePaginationFooter pagination={pagination} />
    </div>
  );
};
