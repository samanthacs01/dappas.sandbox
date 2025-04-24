import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import ReceivablePayersTable from '../components/payers-table/ReceivablePayersTable';
import { getReceivablesPayers } from '@/server/services/receivables';

type ReceivablePayerProps = {
  searchParams: SearchParams;
};

const ReceivablesPayersTableContainer: FunctionComponent<
  ReceivablePayerProps
> = async ({ searchParams }) => {
  const { items, pagination } = await getReceivablesPayers(searchParams);
  return <ReceivablePayersTable {...{ data: items, pagination }} />;
};

export default ReceivablesPayersTableContainer;
