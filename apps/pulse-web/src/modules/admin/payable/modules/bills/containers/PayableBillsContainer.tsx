import { getPayableBillsList } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import PayableBillsTable from '../components/list/PayableBillsTable';

type PayableBillsProps = {
  searchParams: SearchParams;
};

const PayableBillsContainer: FunctionComponent<PayableBillsProps> = async ({
  searchParams,
}) => {
  const { items, pagination } = await getPayableBillsList(searchParams);
  const data = Array.isArray(items) ? items : [];
  

  return <PayableBillsTable {...{ data, pagination }} />;
};

export default PayableBillsContainer;
