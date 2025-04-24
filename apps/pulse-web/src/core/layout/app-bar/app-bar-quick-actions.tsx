'use client';
import { Tooltip } from '@/core/components/common/tooltip';
import { Button } from '@/core/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/core/components/ui/sidebar';
import { DiamondPlus, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
const data = [
  [
    {
      label: 'New Payer',
      icon: Plus,
      href: '/receivables/payers/new',
    },
    {
      label: 'New Production',
      icon: Plus,
      href: '/payables/productions/new',
    },
    {
      label: 'New Expense',
      icon: Plus,
      href: '/expenses/new-expense',
    },
  ],
  [
    {
      label: 'Upload Order',
      icon: Upload,
      href: '/booking/drafts?currentModal=upload-order',
    },
  ],
];
export function AppBarQuickActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-2 text-sm">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip title="Quick actions.">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-accent"
            >
              <DiamondPlus className="!size-5" />
              <span className="sr-only">Quick actions</span>
            </Button>
          </PopoverTrigger>
        </Tooltip>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <Link
                            href={item.href}
                            className="flex gap-1 justify-center items-center"
                          >
                            <SidebarMenuButton>
                              <item.icon /> <span>{item.label}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
