import { Skeleton } from '@workspace/ui/components/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-auto h-[500px]" />
      <div className="flex justify-between">
        <Skeleton className="w-42 h-12" />
        <Skeleton className="w-42 h-12" />
      </div>
    </div>
  );
};

const ProductsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-20 p-8 bg-white w-full">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-42 h-4" />
        <Skeleton className="w-54 h-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {Array.from(new Array(6)).map((n, index) => (
          <ProductCardSkeleton key={`${n}-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductsSkeleton;
