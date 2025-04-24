'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Pagination } from '@/server/types/pagination';
import { ReceivablePayers } from '@/server/types/receivables';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FunctionComponent, useState } from 'react';
import { DeletePayerAlert } from './DeletePayerAlert';
import ReceivablePayerActionsTable from './ReceivablePayerActionsTable';
import ReceivablesPayerFilters from './ReceivablesPayerFilters';
import useReceivablePayers from './useReceivablePayers';

type ReceivablePayerProps = {
  data: ReceivablePayers[];
  pagination: Pagination;
};

const ReceivablePayersTable: FunctionComponent<ReceivablePayerProps> = ({
  data,
  pagination,
}) => {
  const { columns } = useReceivablePayers();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center w-full">
          <ReceivablesPayerFilters />
          <ReceivablePayerActionsTable />
        </div>
        <Table {...{ table, columns }} />
        <TablePaginationFooter {...{ pagination }} />
      </div>
      <DeletePayerAlert />
    </>
  );
};

export default ReceivablePayersTable;
