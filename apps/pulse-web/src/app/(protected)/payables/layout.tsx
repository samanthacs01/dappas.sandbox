import { SidebarInset } from '@/core/components/ui/sidebar';
import AppBar from '@/core/layout/app-bar/app-bar';
import { AppSidebar } from '@/core/layout/sidebar/app-sidebar';
import UploadInsertionOrderModal from '@/modules/admin/booking/modules/io/components/upload-insertion-order/UploadInsertionOrderModal';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar title="Payables" />
      <SidebarInset>
        <AppBar title="Payables" />
        {children}
      </SidebarInset>
      <UploadInsertionOrderModal />
    </>
  );
}
