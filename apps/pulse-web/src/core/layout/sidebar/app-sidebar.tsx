'use client';

import PayableArrow from '@/core/components/icons/payable-arrow';
import ReceivableArrow from '@/core/components/icons/receivable-arrow';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/core/components/ui/sidebar';
import { addFromToUrl } from '@/core/lib/request';
import { paths } from '@/core/lib/routes';
import { BookOpenText, BookText, History, LayoutDashboard } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { NavFooter } from './nav-footer';
import { NavMain } from './nav-main';
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Overview',
      url: addFromToUrl(paths.overview),
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Bookings',
      url: paths.booking.root,
      icon: BookText,
      items: [
        {
          title: 'Overview',
          url: addFromToUrl(paths.booking.root),
        },
        {
          title: 'Orders',
          url: paths.booking.insertion_order,
        },
        {
          title: 'Flights',
          url: paths.booking.flights,
        },
      ],
    },
    {
      title: 'Receivables',
      url: paths.receivable.root,
      icon: ReceivableArrow,
      items: [
        {
          title: 'Overview',
          url: addFromToUrl(paths.receivable.root),
        },
        {
          title: 'Invoices',
          url: paths.receivable.invoices,
        },
        {
          title: 'Payers',
          url: paths.receivable.payers.root,
        },
      ],
    },
    {
      title: 'Payables',
      url: paths.payable.root,
      icon: PayableArrow,
      items: [
        {
          title: 'Overview',
          url: addFromToUrl(paths.payable.root),
        },
        {
          title: 'Bills',
          url: paths.payable.bills,
        },
        {
          title: 'Productions',
          url: paths.payable.productions.root,
        },
      ],
    },
    {
      title: 'Expenses',
      url: paths.expenses.root,
      icon: BookOpenText,
    },
    {
      title: 'Logs',
      url: paths.logs.root,
      icon: History,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <Image
                src={theme === 'dark' ? '/svg/logo_alt.svg' : '/svg/logo.svg'}
                alt="Pulse Logo"
                width={90}
                height={42}
                className="cursor-pointer pl-2"
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
