import AuthGuard from '@/core/components/common/auth/auth-guard';
import { SidebarProvider } from '@/core/components/ui/sidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthGuard>
  );
}
