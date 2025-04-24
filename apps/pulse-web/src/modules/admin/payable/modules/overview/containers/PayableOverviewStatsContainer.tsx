
import { getPayableOverviewStats } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import PayableInsightsOverview from '../components/PayableOverviewStats';

type Props = {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
};

const PayableOverviewStatsContainer = async ({
  searchParams,
  direction,
}: Props) => {
  const payableStats = await getPayableOverviewStats(searchParams);
  if (!payableStats.data) {
    return (
      <div className="text-center">
        Sorry, an error occurred. Please try again later.
      </div>
    );
  }
  return (
    <PayableInsightsOverview stats={payableStats.data} direction={direction} />
  );
};

export default PayableOverviewStatsContainer;
