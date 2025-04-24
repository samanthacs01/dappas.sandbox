import { Card, CardContent, CardHeader } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import CardSkeleton from './card-skeleton';

export const OverviewSectionSkeleton = () => {
  return (
    <div className="p-4 flex gap-4 flex-col w-full ">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-4 w-full">
        <div className="grid gap-4 md:grid-cols-2 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="flex-1" />
          ))}
        </div>
        <Card className="flex-1">
          <CardHeader>
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="flex flex-col gap-2  mb-6 mr-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-8" />
                ))}
              </div>
              <div className="space-y-3 w-full">
                <Skeleton className="h-72 w-full" />
                <div className="flex justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-14" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
