import {
  dateFilterFormat,
  formatDateOrString,
  getCurrentMonthDateRange,
} from '@/core/lib/date';
import { ProductionOverviewDetailsContainer } from '@/modules/admin/payable/modules/overview/containers/ProductionOverviewDetailsContainer';
import { getPayableProduction } from '@/server/services/payable';
import { PageProps } from '@/server/types/pages';

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;

  const { data, error } = await getPayableProduction(id);
  if (!data || error) {
    return null;
  }

  if (!searchParams.from || !searchParams.to) {
    const { from, to } = getCurrentMonthDateRange();
    searchParams.from = formatDateOrString(from, dateFilterFormat);
    searchParams.to = formatDateOrString(to, dateFilterFormat);
  }

  if (!searchParams.id) {
    searchParams.id = id;
  }

  return (
    <ProductionOverviewDetailsContainer
      production={data}
      searchParams={searchParams}
    />
  );
}
