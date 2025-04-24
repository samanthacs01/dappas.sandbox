import { authOptions } from '@/core/lib/auth';
import { ProductionOverviewDetailsContainer } from '@/modules/production/container/ProductionOverviewDetailsContainer';
import { getPayableProduction } from '@/server/services/payable';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user.productionId) {
    return null;
  }

  const { data } = await getPayableProduction(session.user.productionId);

  if (!data) {
    return null;
  }

  return <ProductionOverviewDetailsContainer production={data} />;
}
