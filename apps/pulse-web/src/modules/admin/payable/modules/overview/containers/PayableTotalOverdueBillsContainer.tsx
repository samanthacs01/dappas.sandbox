import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getPayableOverviewStackData } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import PayableTotalOverdueBills from '../components/PayableTotalOverdueBills';

type Props = {
  searchParams: SearchParams;
};

const PayableTotalOverdueBillsContainer = async ({ searchParams }: Props) => {
  const { data } = await getPayableOverviewStackData(
    searchParams,
    'payables_overdue_bills',
  );
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <PayableTotalOverdueBills data={data ?? []} />
    </Suspense>
  );
};

export default PayableTotalOverdueBillsContainer;
