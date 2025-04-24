import { Label } from '@/core/components/ui/label';
import { FC, Suspense } from 'react';
import { ProductionDetailsTabPanelContainer } from './ProductionDetailsTabPanelContainer';

type ProductionHeaderProps = {
  name: string;
};

export const ProductionHeader: FC<ProductionHeaderProps> = ({ name }) => {
  return (
    <>
      <div className="space-x-4">
        <Label className="text-xl font-semibold">Production: {name}</Label>
      </div>
      <Suspense>
        <ProductionDetailsTabPanelContainer />
      </Suspense>
    </>
  );
};
