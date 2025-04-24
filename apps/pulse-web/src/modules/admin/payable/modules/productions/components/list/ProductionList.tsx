'use client';

import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { ProductionListDto } from '@/server/types/payable';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React from 'react';
import { DeleteProductionAlert } from './DeleteProductionAlert';
import useProductionTableColumns from './hooks/useProductionTableColumns';
import ProductionListFilters from './ProductionListFilters';

type Props = {
  data: ProductionListDto[];
  pagination: Pagination;
};

const ProductionList: React.FC<Props> = ({ data, pagination }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { columns } = useProductionTableColumns();

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
      <ProductionListFilters />
      <Table columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
      <DeleteProductionAlert />
    </div>
  );
};

export default ProductionList;
