import AddUserContainer from '@/modules/admin/user-management/containers/AddUserContainer';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page(props: Readonly<Props>) {
  const params = await props.params;
  return <AddUserContainer {...{ id: params.id }} />;
}
