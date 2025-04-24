'use client';
import { Table } from '@/core/components/common/table';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { ActivityLogs } from '@/server/types/logs';
import { Pagination } from '@/server/types/pagination';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FC, useState } from 'react';
import ActivityLogsModalContainer from '../../container/ActivityLogsModalContainer';
import ActivityLogsFilters from './ActivityLogsFilters';
import useActivityLogsTable from './hooks/useActivityLogsTable';

type ActivityLogsProps = {
  data: ActivityLogs[];
  pagination: Pagination;
};

const ActivityLogsTable: FC<ActivityLogsProps> = ({ data, pagination }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { columns } = useActivityLogsTable();

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
    <div className="space-y-4">
      <ActivityLogsFilters />
      <Table columns={columns} table={table} />
      <TablePaginationFooter pagination={pagination} />
      <ActivityLogsModalContainer />
    </div>
  );
};

export default ActivityLogsTable;
