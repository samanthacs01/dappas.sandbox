'use client';

import { ImageWithFallback } from '@/core/components/commons/image/image-with-fallback';
import { AmplitudeContext } from '@/core/providers/amplitude';
import { Product } from '@/server/shopify/types';
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { use } from 'react';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { track } = use(AmplitudeContext);
  return (
    <div className="flex flex-col gap-4 cursor-pointer hover:opacity-80 p-4 rounded-lg transition-all duration-200 hover:shadow-lg">
      <div className="w-full h-[500px] relative">
        <ImageWithFallback
          src={product.images?.[0]?.url ?? ''}
          alt={product.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-row gap-4 px-2 justify-between items-center">
        <h3 className="text-xl font-medium truncate">{product.title}</h3>
        <Link
          href={`/designer?product=${product.id}`}
          onClick={() =>
            track('product-card-click', {
              event_name: 'product-card-click',
              product_id: product.id,
              product_name: product.title,
              page_url: window.location.href,
              page_title: document.title,
              component_name: 'product-card',
              experiment_variant: '',
            })
          }
        >
          <Button variant="default" size="lg">
            Start creating
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
