'use client';
import { Table } from '@/core/components/common/table';
import { Button } from '@/core/components/ui/button';
import { AttachedFile } from '@/server/types/files';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FileText } from 'lucide-react';
import {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';

type Props = {
  data: AttachedFile[];
};

const AttachedFilesTableContainer: FunctionComponent<Props> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleOnDownload = (file: { name: string; path: string }) => {
    const link = document.createElement('a');
    link.href = file.path;
    link.setAttribute('download', file.name);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const columns: ColumnDef<AttachedFile>[] = useMemo(
    () => [
      {
        accessorKey: 'file',
        header: 'File name',
        enableHiding: false,
        cell: ({ row }) => (
          <div className="w-full">{row.original.file.name}</div>
        ),
      },
      {
        accessorKey: 'id',
        header: '',
        cell: ({ row }) => (
          <div className="w-full justify-end flex">
            <Button
              variant={'ghost'}
              className="w-10 h-10"
              type="button"
              onClick={() => handleOnDownload(row.original.file)}
            >
              <FileText />
            </Button>
          </div>
        ),
      },
    ],
    [data],
  );

  const handleSortingChange = useCallback(
    (
      updaterOrState:
        | SortingState
        | ((prevState: SortingState) => SortingState),
    ) => {
      const newSorting =
        typeof updaterOrState === 'function'
          ? updaterOrState(sorting)
          : updaterOrState;

      setSorting((prevSorting) => {
        const updatedSorting = [...prevSorting];

        newSorting.forEach((newSort) => {
          const existingIndex = updatedSorting.findIndex(
            (sort) => sort.id === newSort.id,
          );

          if (existingIndex !== -1) {
            updatedSorting[existingIndex] = newSort;
          } else {
            updatedSorting.push(newSort);
          }
        });

        return updatedSorting;
      });
    },
    [sorting],
  );

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

  return <Table columns={columns} table={table} />;
};

export default AttachedFilesTableContainer;
