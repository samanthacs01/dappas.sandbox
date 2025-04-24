import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getReceivablesOverdueInvoice } from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import TotalOverdueInvoices from '../components/TotalOverdueInvoices';

type Props = {
  searchParams: SearchParams;
};

const TotalOverdueInvoicesContainer = async ({ searchParams }: Props) => {
  const total_overdue = await getReceivablesOverdueInvoice(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <TotalOverdueInvoices data={total_overdue.data ?? []} />
    </Suspense>
  );
};

export default TotalOverdueInvoicesContainer;
