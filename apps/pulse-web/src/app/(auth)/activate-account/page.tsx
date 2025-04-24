import { ActivateAccountContainer } from '@/modules/auth/activate-account/containers/ActivateAccountContainer';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{
    token: string;
  }>;
};

export default async function Page(props: Readonly<Props>) {
  const searchParams = await props.searchParams;
  return (
    <Suspense>
      <ActivateAccountContainer {...{ searchParams }} />;
    </Suspense>
  );
}
