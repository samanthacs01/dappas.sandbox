import { BookingTabPanelContainer } from '@/modules/admin/booking/modules/io/containers/BookingTabPanelContainer';
import { Suspense } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense>
        <div className="flex w-full flex-col p-8 pb-0 gap-4">
          <BookingTabPanelContainer />
        </div>
      </Suspense>
      {children}
    </>
  );
}
