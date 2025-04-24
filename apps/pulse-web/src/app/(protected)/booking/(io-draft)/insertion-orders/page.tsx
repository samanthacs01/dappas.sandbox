import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import BookingInsertionOrdersContainer from '@/modules/admin/booking/modules/io/containers/BookingInsertionOrdersContainer';
import { PageProps } from '@/server/types/pages';
import { Suspense } from 'react';

export default async function Page(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex w-full flex-col p-8 gap-4">
      <Suspense fallback={<TableSkeletonFilters filters={5} />}>
        <BookingInsertionOrdersContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
