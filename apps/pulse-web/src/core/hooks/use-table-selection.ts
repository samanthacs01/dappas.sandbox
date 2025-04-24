import { RowSelectionState, Updater } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

const useTableSelection = <T extends { id: string | number }>(data: T[]) => {
  const [dataSelection, setDataSelection] = useState<T[]>([]);

  const onRowSelectionChange = (func: Updater<RowSelectionState>) => {
    if (typeof func === 'function') {
      const selectedRows = func(rowSelection);
      setDataSelection((prevSelected) => {
        const newSelected = Object.keys(selectedRows)
          .map(
            (id) =>
              data.find((row) => String(row.id) === id) ||
              prevSelected.find((row) => String(row.id) === id),
          )
          .filter((row): row is T => row !== undefined);
        return newSelected;
      });
    }
  };

  const rowSelection = useMemo(() => {
    return dataSelection.reduce<Record<string, boolean>>((acc, row) => {
      acc[row.id] = true;
      return acc;
    }, {});
  }, [dataSelection]);

  const clearRowSelection = () => {
    setDataSelection([]);
  };

  return {
    rowSelection,
    onRowSelectionChange,
    dataSelection,
    clearRowSelection,
  };
};

export default useTableSelection;
