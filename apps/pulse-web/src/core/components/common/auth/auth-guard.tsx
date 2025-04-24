import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default async function AuthGuard({ children }: Props) {
  const session = await getServerSession();
  if (!session) redirect('/login');
  return <>{children}</>;
}
