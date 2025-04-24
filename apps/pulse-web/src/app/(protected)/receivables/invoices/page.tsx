import ReceivablesInvoicesDashboardContainer from '@/modules/admin/receivables/modules/invoices/containers/ReceivablesInvoicesDashboardContainer';
import { SearchParams } from '@/server/types/params';

export default async function Receivables(
  props: Readonly<{
    searchParams: Promise<SearchParams>;
  }>
) {
  const searchParams = await props.searchParams;
  return <ReceivablesInvoicesDashboardContainer {...{ searchParams }} />;
}

export const dynamic = 'force-dynamic';
