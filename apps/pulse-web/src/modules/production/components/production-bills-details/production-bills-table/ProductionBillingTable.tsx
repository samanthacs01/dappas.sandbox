'use client';
import { Table } from '@/core/components/common/table';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { PayableProductionBill } from '@/server/types/payable';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent } from 'react';
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: true,
  });

  return (
    <>
      <ProductionBillingTableFilter />
      <ScrollArea className="w-full max-h-min">
        <Table<PayableProductionBill> columns={columns} table={table} />
        <TablePaginationFooter pagination={pagination} />
      </ScrollArea>
    </>
  );
};
