import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import PayableBillsContainer from '@/modules/admin/payable/modules/bills/containers/PayableBillsContainer';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';

type PayableBillsProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Readonly<PayableBillsProps>) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Bills list</h3>
      <Suspense fallback={<TableSkeletonFilters filters={2} />}>
        <PayableBillsContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
}
