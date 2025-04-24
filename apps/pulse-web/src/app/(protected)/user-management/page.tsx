import UserManagementContainer from '@/modules/admin/user-management/containers/UserManagementContainer';
import { SearchParams } from '@/server/types/params';

type UserProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: Readonly<UserProps>) {
  const searchParams = await props.searchParams;

  return <UserManagementContainer {...{ searchParams }} />;
}
