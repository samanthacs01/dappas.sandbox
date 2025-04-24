import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import { SearchParams } from '@/server/types/params';
import { FunctionComponent, Suspense } from 'react';
import ReceivablesPayersTableContainer from './ReceivablesPayersTableContainer';

type Props = {
  searchParams: SearchParams;
};

const ReceivablesPayersDashboardContainer: FunctionComponent<Props> = ({
  searchParams,
}) => {
  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Payer list</h3>
      <Suspense fallback={<TableSkeletonFilters filters={1} />}>
        <ReceivablesPayersTableContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
};

export default ReceivablesPayersDashboardContainer;
