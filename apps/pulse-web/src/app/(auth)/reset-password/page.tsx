import { SetPasswordContainer } from '@/modules/auth/reset-password/containers/SetPasswordContainer';
import { Suspense } from 'react';

type PageProps = {
  searchParams: Promise<{ token: string }>;
};

export default async function Page(props: Readonly<PageProps>) {
  const searchParams = await props.searchParams;
  return (
    <Suspense>
      <SetPasswordContainer {...{token: searchParams.token}} />
    </Suspense>
  );
}
