import { SearchParams } from '@/server/types/params';
import { PayableProductionDto } from '@/server/types/payable';
import { FC } from 'react';
import { ProductionHeader } from '../components/ProductionHeader';
import { PayableProductionTableSection } from '../components/production-bills-details/PayableProductionTableSection';
import { ProductionDetailsCard } from '../components/production-bills-details/ProductionDetailsCard';

type ProductionBillsDetailsContainerProps = {
  production: PayableProductionDto;
  activeTable: string;
  searchParams: SearchParams
};

export const ProductionBillsDetailsContainer: FC<
  ProductionBillsDetailsContainerProps
> = ({ production, activeTable, searchParams }) => {
  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <ProductionHeader name={production.entity_name} />
      <ProductionDetailsCard productionDetails={production} />
      <PayableProductionTableSection
        activeTable={activeTable}
        paymentType={production.production_billing_type}
        searchParams={searchParams}
      />
    </div>
  );
};
