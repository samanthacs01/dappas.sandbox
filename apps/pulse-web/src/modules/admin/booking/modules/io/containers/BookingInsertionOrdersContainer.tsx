import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import { InsertionOrdersTableContainer } from './InsertionOrdersTableContainer';

type BookingInsertionOrdersContainerProps = {
  searchParams: SearchParams;
};


const BookingInsertionOrdersContainer: FunctionComponent<
  BookingInsertionOrdersContainerProps
> = ({ searchParams }) => {
  return (
    <div className="relative">
      <InsertionOrdersTableContainer searchParams={searchParams} />
      {/* <BookingInformationExtractorContainer /> */}
    </div>
  );
};

export default BookingInsertionOrdersContainer;