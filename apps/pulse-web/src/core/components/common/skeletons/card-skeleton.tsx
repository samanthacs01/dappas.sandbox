import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { Skeleton } from '@/core/components/ui/skeleton';
import { cn } from '@/core/lib/utils';
import { FC } from 'react';

type CardSkeletonProps = {
  className?: string;
};

const CardSkeleton: FC<CardSkeletonProps> = ({ className }) => {
  return (
    <Card className={(cn('min-w-[300px] w-full'), className)}>
      <CardHeader>
        <CardTitle>
          <div className="flex place-content-between items-center w-full">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </CardTitle>
        <CardContent className="p-0">
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default CardSkeleton;
