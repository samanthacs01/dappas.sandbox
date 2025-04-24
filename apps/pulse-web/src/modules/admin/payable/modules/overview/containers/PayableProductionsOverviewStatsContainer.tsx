import { getPayableProductionDetailStats } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import ProductionsOverviewStats from '../../productions/components/details/overview/ProductionsOverviewStats';

type Props = {
  searchParams: SearchParams;
};

const PayableProductionsOverviewStatsContainer = async ({
  searchParams,
}: Props) => {
  const stats = await getPayableProductionDetailStats(searchParams);
  if (!stats.data) {
    return (
      <div className="text-center">
        Sorry, an error occurred. Please try again later.
      </div>
    );
  }
  return <ProductionsOverviewStats stats={stats.data} />;
};

export default PayableProductionsOverviewStatsContainer;
