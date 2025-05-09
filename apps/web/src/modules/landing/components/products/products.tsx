import { Product } from '@/server/shopify/types';
import ProductCard from './product-card';

type ProductsProps = {
  products: Product[];
};

const Products = ({ products }: ProductsProps) => {
  return (
    <div className="flex flex-col gap-y-20 p-8 bg-white w-full">
      <h2 className="text-2xl font-semibold w-full lg:w-[220px]">
        Explore products and add your brand
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
