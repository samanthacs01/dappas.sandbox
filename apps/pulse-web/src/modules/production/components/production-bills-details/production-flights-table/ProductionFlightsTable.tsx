'use client';
import { Table } from '@/core/components/common/table';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { PayableProductionFlight } from '@/server/types/payable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import ProductionFlightsTableFilter from './ProductionFlightsTableFilter';
import useProductionFlightsTable from './useProductionFlightsTable';

type ProductionFlightsTableProps = {
  data: PayableProductionFlight[];
  pagination: Pagination;
};

export const ProductionFlightsTable: FunctionComponent<
  ProductionFlightsTableProps
> = ({ data, pagination }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { columns } = useProductionFlightsTable();

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
      <ProductionFlightsTableFilter />
      <ScrollArea className="w-full max-h-min">
        <Table<PayableProductionFlight> columns={columns} table={table} />
      </ScrollArea>
      <TablePaginationFooter pagination={pagination} />
    </div>
  );
};
