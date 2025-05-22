import { Product } from '@/server/shopify/types';
import { useLoaderData } from 'react-router';
import LandingHero from '../components/hero/hero';
import Products from '../components/products/products';

const LandingContainer = () => {
  const { products } = useLoaderData<{ products: Product[] }>();
  return (
    <div className="h-full w-full overflow-y-auto px-3 py-4 flex flex-col gap-1">
      <LandingHero />
      <Products products={products} />
    </div>
  );
};

export default LandingContainer;
