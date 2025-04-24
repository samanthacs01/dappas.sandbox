import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import { DraftTableContainer } from './DraftTableContainer';

type BookingDraftsContainerProps = {
  searchParams: SearchParams;
};

export const BookingDraftsContainer: FunctionComponent<
  BookingDraftsContainerProps
> = ({ searchParams }) => {
  return (
    <div className="relative">
      <DraftTableContainer searchParams={searchParams} />
      {/* <BookingInformationExtractorContainer /> */}
    </div>
  );
};
