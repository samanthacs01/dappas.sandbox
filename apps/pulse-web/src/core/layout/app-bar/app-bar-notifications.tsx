'use client';

import { Button } from '@/core/components/ui/button';
import { Card } from '@/core/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/core/components/ui/popover';
import { Progress } from '@/core/components/ui/progress';
import { Separator } from '@/core/components/ui/separator';
import { Bell } from 'lucide-react';


export default function AppBarNotifications() {
  // For demo purposes - you would typically manage this with state/data
  const hasNotifications = true;
  const notifications = [
    {
      icon: '✨',
      title: 'Extracting information',
      progress: 48,
      subtitle: '12/25 Documents',
    },
    {
      icon: '📥',
      title: 'Downloading files',
      progress: 75,
      subtitle: '3 minutes remaining',
    },
    {
      icon: '🔄',
      title: 'Processing data',
      progress: 90,
      subtitle: 'Almost done',
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Stay updated with your tasks
                </p>
              </div>
              {hasNotifications && (
                <Button variant="ghost" size="sm" className="text-xs">
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          <Separator />
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="flex flex-col space-y-4 p-4">
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={index}
                    icon={notification.icon}
                    title={notification.title}
                    progress={notification.progress}
                    subtitle={notification.subtitle}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You&apos;re all caught up! We&apos;ll notify you when there&apos;s something
                  new.
                </p>
              </div>
            )}
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  icon,
  title,
  progress,
  subtitle,
}: {
  icon: string;
  title: string;
  progress: number;
  subtitle: string;
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium leading-none">{title}</p>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
