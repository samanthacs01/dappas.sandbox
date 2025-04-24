import { getFlights } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import FlightsTable from '../components/flights-table/FlightsTable';

export const FlightsTableContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { items, pagination } = await getFlights(searchParams);

  return <FlightsTable data={items} pagination={pagination} />;
};
