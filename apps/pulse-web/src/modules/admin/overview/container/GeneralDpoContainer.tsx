import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import { getDaysPayableOutstanding } from '@/server/services/overview';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import GeneralDpo from '../components/charts/GeneralDpo';

type Props = {
    searchParams: SearchParams
}

const GeneralDpoContainer = async ({searchParams}: Props) => {
    const dsoData = await getDaysPayableOutstanding(searchParams);
    return (
      <Suspense fallback={<CustomSkeleton height={300} />}>
        <GeneralDpo data={dsoData.data ?? []} />
      </Suspense>
    );
}

export default GeneralDpoContainer