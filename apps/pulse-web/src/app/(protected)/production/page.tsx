import { paths } from '@/core/lib/routes';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(paths.production.details.overview);
}
