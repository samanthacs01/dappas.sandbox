import { FC } from 'react';
import { PayableProductionDto } from '@/server/types/payable';
import { ProductionHeader } from '../components/ProductionHeader';
import ProductionsDetailsOverview from '../components/production-overview-details/ProductionsDetailsOverview';

type ProductionOverviewDetailsContainerProps = {
  production: PayableProductionDto;
};

export const ProductionOverviewDetailsContainer: FC<
  ProductionOverviewDetailsContainerProps
> = ({ production }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductionHeader name={production.entity_name} />
      <ProductionsDetailsOverview />
    </div>
  );
};
