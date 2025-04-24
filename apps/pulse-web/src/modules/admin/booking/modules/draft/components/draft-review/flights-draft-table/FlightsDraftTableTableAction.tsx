'use client';
import { Button } from '@/core/components/ui/button';
import { getEmptyFlight } from '@/modules/admin/booking/utils/data';
import { DraftDetails, DraftFlights } from '@/server/types/booking';
import { Row } from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

type FlightsDraftTableTableActionProps = {
  selectedRows: Row<DraftFlights>[];
  clearSelectedRows: VoidFunction;
};

export const FlightsDraftTableTableAction: FC<
  FlightsDraftTableTableActionProps
> = ({ selectedRows, clearSelectedRows }) => {
  const enableDelete = useMemo(() => !!selectedRows.length, [selectedRows]);
  const { setValue, getValues } = useFormContext<DraftDetails>();

  const deleteSelectedDrafts = () => {
    const flights: DraftFlights[] = getValues('flights');
    const filteredFlights = flights.filter(
      (_, index) => !selectedRows.map((row) => row.index).includes(index),
    );
    clearSelectedRows();
    setValue('flights', filteredFlights);
  };

  const addNewRow = () => {
    const flights: DraftFlights[] = getValues('flights');
    const newFlights = flights.concat([getEmptyFlight()]);
    setValue('flights', newFlights);
  };

  return (
    <div className="flex items-center space-x-4 w-fit">
      <Button type="button" onClick={addNewRow}>
        <Plus />
        Add new row
      </Button>
      <Button
        disabled={!enableDelete}
        type="button"
        onClick={deleteSelectedDrafts}
      >
        <Trash2 />
        Delete selected rows
      </Button>
    </div>
  );
};
