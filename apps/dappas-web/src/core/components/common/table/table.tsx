import {
  Table as ShadCNTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table';
import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
} from '@tanstack/react-table';
import clsx from 'clsx';

interface CustomTableProps<T> {
  table: TanstackTable<T>;
  columns: ColumnDef<T>[];
  className?: string;
}

export function Table<T>({ table, columns, className }: CustomTableProps<T>) {
  return (
    <div
      className={clsx('rounded-md border bg-white dark:bg-inherit', className)}
    >
      <ShadCNTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={`${headerGroup.id}-${header.id}`}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={`${row.id}-${cell.id}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadCNTable>
    </div>
  );
}
