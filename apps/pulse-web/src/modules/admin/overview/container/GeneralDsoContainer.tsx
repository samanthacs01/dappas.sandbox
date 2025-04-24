import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getDaysSalesOutstanding } from '@/server/services/overview';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import GeneralDso from '../components/charts/GeneralDso';

type Props = {
  searchParams: SearchParams;
};

const GeneralDsoContainer = async ({ searchParams }: Props) => {
  const dsoData = await getDaysSalesOutstanding(searchParams);
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <GeneralDso data={dsoData.data ?? []} />
    </Suspense>
  );
};

export default GeneralDsoContainer;
