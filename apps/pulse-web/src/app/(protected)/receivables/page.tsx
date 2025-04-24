import { formatDateOrString, getCurrentMonthDateRange } from '@/core/lib/date';
import ReceivableOverviewContainer from '@/modules/admin/receivables/modules/overview/containers/ReceivableOverviewContainer';
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

  return (
    <div className="p-4">
      <ReceivableOverviewContainer {...{ searchParams }} />
    </div>
  );
}
