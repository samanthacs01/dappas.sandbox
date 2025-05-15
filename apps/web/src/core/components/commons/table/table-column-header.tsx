import { Column, SortDirection } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useCallback, useMemo } from 'react';

type TableColumnHeaderProps<T> = {
  label: string;
  column: Column<T>;
  disableSorting?: boolean;
  align?: 'left' | 'center' | 'right';
};

export const TableColumnHeader = <T,>({
  column,
  label,
  disableSorting,
  align = 'left',
}: TableColumnHeaderProps<T>) => {
  const getIconByStatus = useCallback((sortStatus: SortDirection | false) => {
    switch (sortStatus) {
      case 'asc':
        return <ArrowUp />;
      case 'desc':
        return <ArrowDown />;
      default:
        return <ArrowUpDown />;
    }
  }, []);

  const onChangeSorting = () => {
    if (!disableSorting) {
      column.toggleSorting(column.getIsSorted() === 'asc');
    }
  };

  const columnAlignment = useMemo(() => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
    }
  }, [align]);

  return (
    <Button
      variant="ghost"
      onClick={onChangeSorting}
      className={clsx('w-full flex', columnAlignment)}
      type="button"
    >
      {label}
      {!disableSorting && getIconByStatus(column.getIsSorted())}
    </Button>
  );
};
