import { formatDateOrString, getCurrentMonthDateRange } from '@/core/lib/date';
import OverviewContainer from '@/modules/admin/overview/container/OverviewContainer';
import { SearchParams } from '@/server/types/params';

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  if (!searchParams.from || !searchParams.to) {
    const { from, to } = getCurrentMonthDateRange();
    searchParams.from = formatDateOrString(from);
    searchParams.to = formatDateOrString(to);
  }
  return <OverviewContainer {...{ searchParams }} />;
}
