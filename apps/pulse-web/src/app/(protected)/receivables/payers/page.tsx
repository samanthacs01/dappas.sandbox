import ReceivablesPayersDashboardContainer from '@/modules/admin/receivables/modules/payers/containers/ReceivablesPayersDashboardContainer';
import { SearchParams } from '@/server/types/params';

export default async function Page(
  props: Readonly<{ searchParams: Promise<SearchParams> }>,
) {
  const searchParams = await props.searchParams;
  return <ReceivablesPayersDashboardContainer {...{ searchParams }} />;
}
