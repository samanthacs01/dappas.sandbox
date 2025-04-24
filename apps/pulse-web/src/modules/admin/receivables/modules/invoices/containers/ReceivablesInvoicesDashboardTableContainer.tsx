import { getReceivablesInvoices } from '@/server/services/receivables';
import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import ReceivableInvoiceTable from '../components/receivables-invoices-table/ReceivableInvoiceTable';

type ReceivableInvoiceTableContainerProps = {
  searchParams: SearchParams;
};

const ReceivablesInvoicesDashboardTableContainer: FunctionComponent<
  ReceivableInvoiceTableContainerProps
> = async ({ searchParams }) => {
  const { page, size, ...restParams } = searchParams;
  const newSearch = {
    page: page ?? 1,
    size: size ?? 5,
    ...restParams,
  };

  const { items, pagination } = await getReceivablesInvoices(newSearch);

  return <ReceivableInvoiceTable {...{ data: items, pagination }} />;
};

export default ReceivablesInvoicesDashboardTableContainer;
