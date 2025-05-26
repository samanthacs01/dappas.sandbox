'use client';

import { Product } from '@/server/product/types/product';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';
import { ImageWithFallback } from '../image/image-with-fallback';

interface ProductCardProps {
  className?: string;
  onClick?: () => void;
  product: Product;
}

export default function ProductCard({
  className,
  onClick,
  product,
}: ProductCardProps) {
  const { imageUrl, name, price, description } = product;

  return (
    <div
      className={cn(
        'w-full h-full border bg-white transition-all duration-200 ease-in-out group',
        'flex flex-col',
        'hover:shadow-md',
        className,
      )}
      onClick={onClick}
    >
      <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 flex items-center justify-center p-4 overflow-hidden">
        <ImageWithFallback
          src=""
          alt={name || 'Product packaging'}
          fill
          className="object-contain max-h-full max-w-full transition-all duration-200 ease-in-out group-hover:scale-105"
        />
      </div>

      <Separator className="bg-[#E5E5E5] h-[1px] w-full" />

      <div className="flex flex-col gap-1 p-3 flex-grow">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium line-clamp-1 text-primeColor">
            {name}
          </h2>
        </div>
        <p className="text-[#767676] font-medium text-[14px]">
          ${typeof price === 'number' ? price.toFixed(2) : price}
        </p>
        <p className="text-[#767676] text-[14px] line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
