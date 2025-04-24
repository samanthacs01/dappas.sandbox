import { SearchParams } from '@/server/types/params';
import { PayableProductionDto } from '@/server/types/payable';
import { FC } from 'react';
import RegisterPaymentModalContainer from '../../../containers/RegisterPaymentModalContainer';
import { ProductionHeader } from '../components/details/ProductionHeader';
import { PayableProductionTableSection } from '../components/details/bills/PayableProductionTableSection';
import { ProductionDetailsCard } from '../components/details/bills/ProductionDetailsCard';

type ProductionBillsDetailsContainerProps = {
  production: PayableProductionDto;
  searchParams: SearchParams;
};

export const ProductionBillsDetailsContainer: FC<
  ProductionBillsDetailsContainerProps
> = ({ production, searchParams }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ProductionHeader name={production.entity_name} />
      <ProductionDetailsCard productionDetails={production} />
      <PayableProductionTableSection
        paymentType={production.production_billing_type}
        searchParams={{ ...searchParams, p_id: production.id }}
      />
      <RegisterPaymentModalContainer />
    </div>
  );
};
