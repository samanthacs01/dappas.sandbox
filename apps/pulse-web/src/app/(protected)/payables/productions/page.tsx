import TableSkeletonFilters from '@/core/components/common/skeletons/table-skeleton-filters';
import { Button } from '@/core/components/ui/button';
import PayableProductionContainer from '@/modules/admin/payable/modules/productions/containers/ProductionContainer';
import { SearchParams } from '@/server/types/params';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

type ReceivablePayerProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Readonly<ReceivablePayerProps>) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full h-full p-8 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Productions list</h3>
        <Link
          href="/payables/productions/new"
          className="flex items-center gap-2"
        >
          <Button>
            <Plus />
            Create production
          </Button>
        </Link>
      </div>
      <Suspense fallback={<TableSkeletonFilters filters={1} />}>
        <PayableProductionContainer {...{ searchParams }} />
      </Suspense>
    </div>
  );
}
