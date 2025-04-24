'use client';
import { Table } from '@/core/components/common/table';
import { Label } from '@/core/components/ui/label';
import useTableSelection from '@/core/hooks/use-table-selection';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { TablePaginationFooter } from '@/modules/commons/table/PaginationFooter';
import { Flight } from '@/server/types/booking';
import { Pagination } from '@/server/types/pagination';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { FlightsAction } from './FlightsActionTableAction';
import FlightsTableFilter from './FlightsTableFilter';
import useFlightsTable from './useFlightsTable';

type FlightsTableProps = {
  data: Flight[];
  pagination: Pagination;
};

const FlightsTable: FunctionComponent<FlightsTableProps> = ({
  data,
  pagination,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    dataSelection,
    onRowSelectionChange,
    rowSelection,
    clearRowSelection,
  } = useTableSelection<Flight>(data);

  const { columns } = useFlightsTable();

  const handleSortingChange = useTableSorting({ sorting, setSorting });

  const table = useReactTable({
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
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex w-full justify-between">
        <Label className="text-lg font-semibold">Flights list</Label>
        <FlightsAction
          selectedRows={dataSelection}
          clearSelection={clearRowSelection}
        />
      </div>
      <div className="w-full space-y-4">
        <div className="flex justify-between">
          <FlightsTableFilter />
        </div>
        <Table<Flight> columns={columns} table={table} />
        <TablePaginationFooter pagination={pagination} />
      </div>
    </>
  );
};

export default FlightsTable;
