import { getReceivableOverviewStats } from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import ReceivableStats from '../components/ReceivableOverviewStats';

type Props = {
  searchParams: SearchParams;
  direction?: 'horizontal' | 'vertical';
};

const ReceivableOverviewStatsContainer = async ({ searchParams, direction }: Props) => {
  const { data } = await getReceivableOverviewStats(searchParams);

  if (!data) {
    return (
      <div className="text-center">
        Sorry, an error occurred. Please try again later.
      </div>
    );
  }

  return <ReceivableStats stats={data} direction={direction} />;
};

export default ReceivableOverviewStatsContainer;
