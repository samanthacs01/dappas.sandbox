'use client';

import { LogOut, User } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/core/components/ui/sidebar';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function NavFooter() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="User management">
          <Link href="/user-management">
            <User />
            <span>User management</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarSeparator />
      <SidebarMenuItem onClick={handleLogout}>
        <SidebarMenuButton asChild tooltip="Logout">
          <div className="flex items-center cursor-pointer">
            <LogOut />
            <span>Log out</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
