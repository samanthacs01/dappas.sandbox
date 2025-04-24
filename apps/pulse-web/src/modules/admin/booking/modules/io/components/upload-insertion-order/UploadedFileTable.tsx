'use client';
import { Table } from '@/core/components/common/table';
import { UploadedDocument } from '@/server/types/booking';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FunctionComponent } from 'react';
import { FileWithPath } from 'react-dropzone';
import useUploadedTable from './useUploadedTable';

type UploadedFileTableProps = {
  data: UploadedDocument[];
  removeDocument: (fileToRemove: FileWithPath) => void;
  disabled?: boolean;
};

export const UploadedFileTable: FunctionComponent<UploadedFileTableProps> = ({
  data,
  removeDocument,
  disabled,
}) => {
  const { columns } = useUploadedTable({ removeDocument, disabled });

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
    <div className="w-full space-y-4">
      {!!data.length && (
        <Table<UploadedDocument> columns={columns} table={table} />
      )}
    </div>
  );
};
