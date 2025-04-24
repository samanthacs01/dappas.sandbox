import { ProductionBillsDetailsContainer } from '@/modules/admin/payable/modules/productions/containers/ProductionBillsDetailsContainer';
import { getPayableProduction } from '@/server/services/payable';
import { PageProps } from '@/server/types/pages';

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;

  const { data, error } = await getPayableProduction(id);
  if (!data || error) {
    return null;
  }

  return (
    <ProductionBillsDetailsContainer
      production={data}
      searchParams={searchParams}
    />
  );
}
