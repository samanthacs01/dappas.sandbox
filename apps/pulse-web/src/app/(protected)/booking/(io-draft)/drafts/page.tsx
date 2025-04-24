import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import { BookingDraftsContainer } from '@/modules/admin/booking/modules/draft/containers/BookingDraftsContainer';
import { PageProps } from '@/server/types/pages';
import { Suspense } from 'react';

export default async function Page(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex w-full flex-col p-8 gap-4">
      <Suspense fallback={<TableSkeletonFilters filters={1} />}>
        <BookingDraftsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
