'use client';
import { CustomSkeleton } from '@/core/components/common/skeletons/custom-skeleton';

const DraftReviewSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <CustomSkeleton width={'100%'} height={400} />
        <div className="flex flex-col gap-6">
          <CustomSkeleton variant={'list'} />
          <div className="flex flex-col gap-2">
            <CustomSkeleton height={10} width={150} />
            <CustomSkeleton height={35} width={'100%'} />
          </div>
          <div className="flex flex-col gap-2">
            <CustomSkeleton height={10} width={100} />
            <CustomSkeleton height={35} width={'100%'} />
          </div>
          <div className="flex flex-col gap-2">
            <CustomSkeleton height={10} width={150} />
            <CustomSkeleton height={35} width={'100%'} />
          </div>
          <div className="flex flex-col gap-2">
            <CustomSkeleton height={10} width={100} />
            <CustomSkeleton height={35} width={'100%'} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <CustomSkeleton height={15} width={150} />
          <div className="flex gap-2">
            <CustomSkeleton height={40} width={200} />
            <CustomSkeleton height={40} width={200} />
          </div>
        </div>
        <CustomSkeleton variant="table" />
      </div>
    </div>
  );
};

export default DraftReviewSkeleton;
