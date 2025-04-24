import { authOptions } from '@/core/lib/auth';
import { addFromToUrl } from '@/core/lib/request';
import { paths } from '@/core/lib/routes';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect(paths.security.login);
  switch (session.user.role) {
    case 'admin':
      return redirect(addFromToUrl(paths.overview));
    case 'production':
      return redirect(addFromToUrl(paths.production.details.overview));
    default:
      return redirect(paths.security.login);
  }
}
export const dynamic = 'force-dynamic';
