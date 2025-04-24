import { SidebarInset } from '@/core/components/ui/sidebar';
import AppBar from '@/core/layout/app-bar/app-bar';
import { AppSidebar } from '@/core/layout/sidebar/app-sidebar';
import WebSocketProvider from '@/core/providers/web-socket/web-socket-provider';
import BookingInformationExtractorContainer from '@/modules/admin/booking/containers/BookingExtractingInformationContainer';
import UploadInsertionOrderModal from '@/modules/admin/booking/modules/io/components/upload-insertion-order/UploadInsertionOrderModal';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebSocketProvider url={`${process.env.NEXT_APP_API_URL}/ws`}>
      <AppSidebar title="Booking" />
      <SidebarInset>
        <AppBar title="Booking" />
        {children}
      </SidebarInset>
      <UploadInsertionOrderModal />
      <BookingInformationExtractorContainer />
    </WebSocketProvider>
  );
}
