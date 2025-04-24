import ActivityLogsContainer from '@/modules/admin/activity-logs/container/ActivityLogsContainer';
import { SearchParams } from '@/server/types/params';

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;

  return <ActivityLogsContainer {...{ searchParams }} />;
}
