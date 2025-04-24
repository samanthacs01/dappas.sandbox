'use client';
import { Table } from '@/core/components/common/table';
import { Label } from '@/core/components/ui/label';
import { useTableSorting } from '@/core/hooks/use-table-sorting';
import { DraftDetails, DraftFlights } from '@/server/types/booking';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import { FlightsDraftTableTableAction } from './FlightsDraftTableTableAction';
import useFlightsDraftTableTable from './useFlightsDraftTableTable';

const FlightsDraftTable: FunctionComponent = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { columns } = useFlightsDraftTableTable();
  const { watch } = useFormContext<DraftDetails>();

  const data = watch('flights');

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
      <div className="flex justify-between">
        <Label className="text-xl leading-7 font-semibold">Flights</Label>
        <FlightsDraftTableTableAction
          selectedRows={table.getFilteredSelectedRowModel().rows}
          clearSelectedRows={table.resetRowSelection}
        />
      </div>
      <div className="overflow-x-auto max-w-full">
        <Table<DraftFlights>
          columns={columns}
          table={table}
          className="min-w-max"
        />
      </div>
    </div>
  );
};

export default FlightsDraftTable;
