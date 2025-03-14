import { Button } from '@/core/components/ui/button';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Table } from '../../table';
import { UploadFile } from '../types';

type Props = {
  data: UploadFile[];
  onRemove: (file: string) => void;
};

const UploadButtonTable: FunctionComponent<Props> = ({ data, onRemove }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<UploadFile>[] = useMemo(
    () => [
      {
        accessorKey: 'fileName',
        header: 'File name',
        enableHiding: false,
        cell: ({ row }) => <div>{row.getValue('fileName')}</div>,
      },
      {
        accessorKey: 'id',
        header: () => null,
        cell: ({ row }) => (
          <div className="flex justify-end w-full">
            <Button
              variant={'ghost'}
              className="w-10 h-10"
              type="button"
              onClick={() => onRemove(row.getValue('fileName'))}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      },
    ],
    [onRemove],
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

export default UploadButtonTable;
