import ProductListSection from '@/core/components/commons/list/product-list-section';
import { extendedMockProducts } from '@/server/_mock/_products';

const ProductListContainer = () => {
  return (
    <div className="relative">
      <ProductListSection categories={extendedMockProducts} />
    </div>
  );
};

export default ProductListContainer;
