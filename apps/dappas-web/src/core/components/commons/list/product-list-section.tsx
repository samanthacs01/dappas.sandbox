import { ProductCategory } from '@/server/product/types/product';
import React, { FC } from 'react';
import ProductCard from '../card/product-card';
import { cn } from '@workspace/ui/lib/utils';

type ProductListSectionProps = {
  onClick?: VoidFunction;
  categories: ProductCategory[];
  className?: string;
};

const ProductListSection: FC<ProductListSectionProps> = ({
  categories,
  onClick,
  className,
}) => {
  return (
    <div className={cn(className)}>
      {categories.map((category, index) => (
        <div key={`${category.name}-${index}`} className="mb-8">
          <div className="bg-white w-full sticky top-16 md:top-15 py-2 z-10">
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
          </div>
          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4  xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListSection;
