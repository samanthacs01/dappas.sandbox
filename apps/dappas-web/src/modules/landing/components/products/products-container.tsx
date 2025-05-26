import { getProducts } from '@/server/shopify';
import Products from './products';

const ProductsContainer = async () => {
  const products = await getProducts({ first: 10 });

  return <Products products={products} />;
};
export default ProductsContainer;
