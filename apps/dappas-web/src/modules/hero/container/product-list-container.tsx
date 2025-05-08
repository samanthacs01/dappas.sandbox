import ProductListSection from '@/core/components/common/list/product-list-section';
import { extendedMockProducts } from '@/server/_mock/_products';
import React from 'react';

const ProductListContainer = () => {
  return (
    <div className="relative">
      <ProductListSection categories={extendedMockProducts} />
    </div>
  );
};

export default ProductListContainer;
