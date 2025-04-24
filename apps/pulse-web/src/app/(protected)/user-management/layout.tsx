import { SidebarInset } from '@/core/components/ui/sidebar';
import AppBar from '@/core/layout/app-bar/app-bar';
import { AppSidebar } from '@/core/layout/sidebar/app-sidebar';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppSidebar title="User management" />
      <SidebarInset style={{}} className="overflow-hidden">
        <AppBar title="User management" />
        {children}
      </SidebarInset>
    </>
  );
}
