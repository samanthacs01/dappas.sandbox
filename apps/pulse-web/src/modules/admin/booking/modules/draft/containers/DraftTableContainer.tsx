import { getDrafts } from '@/server/services/booking';
import { SearchParams } from '@/server/types/params';
import DraftsTable from '../components/drafts-table/DraftsTable';

export const DraftTableContainer = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { items, pagination } = await getDrafts(searchParams);

  return <DraftsTable data={items} pagination={pagination} />;
};
