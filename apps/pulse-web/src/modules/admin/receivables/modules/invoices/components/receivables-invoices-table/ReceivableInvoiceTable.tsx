'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePagination } from '@/modules/commons/table/Pagination';
import { Pagination } from '@/server/types/pagination';
import { ReceivablesInvoices } from '@/server/types/receivables';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import ReceivablesInvoicesFilters from './ReceivablesFilters';
import useReceivablesInvoicesTable from './useReceivablesInvoicesTable';

type ReceivableInvoiceProps = {
  data: ReceivablesInvoices[];
  pagination: Pagination;
};

const ReceivableInvoiceTable: FunctionComponent<ReceivableInvoiceProps> = ({
  pagination,
  data,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { columns } = useReceivablesInvoicesTable();

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
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center w-full">
        <ReceivablesInvoicesFilters />
      </div>

      <Table {...{ table, columns }} />
      <TablePagination {...{ pagination }} />
    </div>
  );
};

export default ReceivableInvoiceTable;
