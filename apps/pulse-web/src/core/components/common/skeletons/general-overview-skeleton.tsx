import { Skeleton } from '../../ui/skeleton';
import { OverviewSectionSkeleton } from './overview-section-skeleton';

export const GeneralOverviewSkeleton = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex justify-end px-4 pt-4">
        <Skeleton className="h-8 w-44" />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <OverviewSectionSkeleton key={`overview-section-${index}`} />
      ))}
    </div>
  );
};
