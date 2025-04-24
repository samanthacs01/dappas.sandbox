import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getGrossMargin } from '@/server/services/overview';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import GeneralGrossMargin from '../components/charts/GeneralGrossMargin';

type Props = {
  searchParams: SearchParams;
};

const GeneralGrossMarginContainer = async ({ searchParams }: Props) => {
  const grossData = await getGrossMargin(searchParams);

  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      <GeneralGrossMargin data={grossData.data ?? []} />
    </Suspense>
  );
};

export default GeneralGrossMarginContainer;
