import { GeneralOverviewSkeleton } from '@/core/components/common/skeletons/general-overview-skeleton';
import BookingOverviewContainer from '@/modules/admin/booking/modules/overview/containers/BookingOverviewContainer';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableOverviewContainer from '../../payable/modules/overview/containers/PayableOverviewContainer';
import ReceivableOverviewContainer from '../../receivables/modules/overview/containers/ReceivableOverviewContainer';
import OverviewSection from '../components/OverviewSection';
import OverviewGeneralContainer from './OverviewGeneralContainer';

const OverviewContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  return (
    <Suspense fallback={<GeneralOverviewSkeleton />}>
      <div className="space-y-2 p-4">
        <div className="flex justify-end">
          <DateRangeFilter />
        </div>
        <div className="space-y-8">
          <OverviewSection title="General">
            <OverviewGeneralContainer searchParams={searchParams} />
          </OverviewSection>
          <OverviewSection title="Booking">
            <BookingOverviewContainer
              searchParams={searchParams}
              direction="horizontal"
            />
          </OverviewSection>
          <OverviewSection title="Receivables">
            <ReceivableOverviewContainer
              {...{ searchParams, direction: 'horizontal' }}
            />
          </OverviewSection>
          <OverviewSection title="Payables">
            <PayableOverviewContainer
              {...{ searchParams, direction: 'horizontal' }}
            />
          </OverviewSection>
        </div>
      </div>
    </Suspense>
  );
};

export default OverviewContainer;
