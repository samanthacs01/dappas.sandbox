import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';
import {
  getReceivableCollectionOverall,
  getReceivableCollectionWithPaymentTerms,
} from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import { Suspense } from 'react';
import CollectionRateOverview from '../components/CollectionRateOverview';

type Props = {
  searchParams: SearchParams;
};

const CollectionRateContainer = async ({ searchParams }: Props) => {
  const overallData = await getReceivableCollectionOverall(searchParams);
  const withPaymentData =
    await getReceivableCollectionWithPaymentTerms(searchParams);
  return (
    <Suspense fallback={<CustomSkeleton height={300} />}>
      {overallData.data || withPaymentData.data ? (
        <CollectionRateOverview
          overallRate={overallData.data ?? []}
          withPayment={withPaymentData.data ?? []}
        />
      ) : (
        <h3 className="text-center text-lg text-muted-foreground ">
          No data available
        </h3>
      )}
    </Suspense>
  );
};

export default CollectionRateContainer;
