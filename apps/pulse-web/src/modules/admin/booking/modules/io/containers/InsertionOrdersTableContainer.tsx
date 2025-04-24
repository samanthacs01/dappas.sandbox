import { getInsertionOrders } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import InsertionOrdersTable from '../components/insertion-orders-table/InsertionOrdersTable';

export const InsertionOrdersTableContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { items, pagination } = await getInsertionOrders(searchParams);

  return <InsertionOrdersTable data={items} pagination={pagination} />;
};
