'use client';
import { Table } from '@/core/components/common/table';
import useTableSelection from '@/core/hooks/use-table-selection';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { revalidateServerTags } from '@/core/lib/cache';
import useWebSocket from '@/core/providers/web-socket/use-web-socket';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Draft } from '@/server/types/booking';
import { Pagination } from '@/server/types/pagination';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { FunctionComponent, useEffect } from 'react';
import { DraftsTableActionTableAction } from './DraftsTableAction';
import DraftsTableFilter from './DraftsTableFilter';
import useDraftsTable from './useDraftsTable';

type DraftsTableTableProps = {
  data: Draft[];
  pagination: Pagination;
};

const DraftsTable: FunctionComponent<DraftsTableTableProps> = ({
  data,
  pagination,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { dataSelection, onRowSelectionChange, rowSelection } =
    useTableSelection<Draft>(data);
  const { columns } = useDraftsTable();

  const handleSortingChange = useTableSorting({ sorting, setSorting });

  const { message } = useWebSocket();
  useEffect(() => {
    revalidateServerTags('drats');
  }, [message?.pending_to_review]);

  const table = useReactTable({
    getRowId: (row) => String(row.id),
    data,
    columns,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: onRowSelectionChange,
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
        <DraftsTableFilter />
        <DraftsTableActionTableAction selectedRows={dataSelection} />
      </div>
      <Table<Draft> columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
    </div>
  );
};

export default DraftsTable;
