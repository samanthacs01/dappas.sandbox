'use client';
import { Table } from '@/core/components/common/table';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePagination } from '@/modules/commons/table/Pagination';
import { Pagination } from '@/server/types/pagination';
import { PayableProductionBill } from '@/server/types/payable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import ProductionBillingTableFilter from './ProductionBillingTableFilter';
import useProductionBillingTable from './useProductionBillingTable';

type ProductionBillingTableProps = {
  data: PayableProductionBill[];
  pagination: Pagination;
};

export const ProductionBillingTable: FunctionComponent<
  ProductionBillingTableProps
> = ({ data, pagination }) => {
  const { columns } = useProductionBillingTable();
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
    <>
      <ProductionBillingTableFilter />
      <ScrollArea className="w-full max-h-min">
        <Table<PayableProductionBill> columns={columns} table={table} />
        <TablePagination pagination={pagination} />
      </ScrollArea>
    </>
  );
};
