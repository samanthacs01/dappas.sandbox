'use client';
import { Table } from '@/core/components/common/table';
import { ScrollArea } from '@/core/components/ui/scroll-area';
import { Invoice } from '@/server/types/booking';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent } from 'react';
import useInvoicesTable from './useFlightsTable';

type InvoicesTableProps = {
  data: Invoice[];
};

export const InvoicesTable: FunctionComponent<InvoicesTableProps> = ({
  data,
}) => {
  const { columns } = useInvoicesTable();

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
    <ScrollArea className="w-full space-y-4 max-h-[484px]">
      <Table<Invoice> columns={columns} table={table} />
    </ScrollArea>
  );
};
