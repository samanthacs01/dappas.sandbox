import { SidebarInset } from '@/core/components/ui/sidebar';
import AppBar from '@/core/layout/app-bar/app-bar';
import { AppSidebar } from '@/core/layout/sidebar/app-sidebar';

export default function ExpensesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar title="Expenses" />
      <SidebarInset style={{}} className="overflow-hidden">
        <AppBar title="Expenses" />
        {children}
      </SidebarInset>
    </>
  );
}
