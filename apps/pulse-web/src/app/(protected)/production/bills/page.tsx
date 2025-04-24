import { authOptions } from '@/core/lib/auth';
import { ProductionBillsDetailsContainer } from '@/modules/production/container/ProductionBillsDetailsContainer';
import { getPayableProduction } from '@/server/services/payable';
import { PageProps } from '@/server/types/pages';
import { getServerSession } from 'next-auth';

export default async function Page(props: PageProps) {
  const session = await getServerSession(authOptions);
  const { table, ...searchParams } = await props.searchParams;

  if (!session?.user.productionId) {
    return null;
  }

  const { data } = await getPayableProduction(session.user.productionId);

  if (!data) {
    return null;
  }

  return (
    <ProductionBillsDetailsContainer
      production={data}
      activeTable={(table as string) ?? ''}
      searchParams={searchParams}
    />
  );
}
