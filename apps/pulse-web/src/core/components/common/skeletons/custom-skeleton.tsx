import { Skeleton } from '@/core/components/ui/skeleton';
import { cn } from '@/core/lib/utils';
import clsx from 'clsx';
import React from 'react';

export interface CustomSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'list' | 'table' | 'grid';
  count?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  color?: string;
  highlightColor?: string;
  rows?: number;
  columns?: number;
  gap?: number;
  cardAspectRatio?: number;
  listItemHeight?: number | string;
  tableColumns?: number;
  tableRows?: number;
}

export const CustomSkeleton: React.FC<CustomSkeletonProps> = ({
  variant = 'default',
  count = 1,
  width,
  height,
  circle = false,
  color,
  highlightColor,
  rows = 3,
  columns = 3,
  gap = 4,
  cardAspectRatio = 16 / 9,
  listItemHeight = '1rem',
  tableColumns = 4,
  tableRows = 3,
  className,
  style,
  ...props
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-2">
            <Skeleton className="h-32 sm:h-40 md:h-48 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        );
      case 'list':
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%] sm:w-[85%] md:w-[80%]" />
          </div>
        );
      case 'table':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full hidden sm:block" />
              <Skeleton className="h-4 w-full hidden sm:block" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        );
      default:
        return (
          <Skeleton
            className={clsx(
              circle ? 'rounded-full' : 'rounded-md',
              'w-full sm:w-auto',
            )}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
            }}
            {...props}
          />
        );
    }
  };

  return (
    <div className={cn('flex gap-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-full">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};
