import { Suspense } from 'react';
import LandingHero from '../components/hero/hero';
import ProductsContainer from '../components/products/products-container';
import ProductsSkeleton from '../components/products/products-skeleton';

const LandingContainer = async () => {
  return (
    <div className="h-full w-full overflow-y-auto px-3 py-4 flex flex-col gap-1">
      <LandingHero />
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContainer />
      </Suspense>
    </div>
  );
};

export default LandingContainer;
