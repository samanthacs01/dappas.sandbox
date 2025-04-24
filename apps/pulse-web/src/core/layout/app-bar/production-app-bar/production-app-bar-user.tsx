import { Label } from '@/core/components/ui/label';
import { authOptions } from '@/core/lib/auth';
import { getServerSession } from 'next-auth/next';

export const ProductionAppBarUser: React.FC = async () => {
  const session = await getServerSession(authOptions);

  return <Label>{session?.user.email}</Label>;
};
