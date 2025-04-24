import { FunctionComponent } from 'react';
import { SearchParams } from '@/server/types/params';
import { FlightsTableContainer } from './FlightsTableContainer';

type BookingFlightsContainerProps = {
  searchParams: SearchParams;
};

export const BookingFlightsContainer: FunctionComponent<
  BookingFlightsContainerProps
> = ({ searchParams }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <FlightsTableContainer searchParams={searchParams} />
    </div>
  );
};
