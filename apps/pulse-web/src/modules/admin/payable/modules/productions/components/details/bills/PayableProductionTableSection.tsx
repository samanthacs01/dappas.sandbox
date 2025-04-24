import { ProductionExpensesTableContainer } from '@/modules/admin/payable/modules/productions/containers/ProductionExpensesTableContainer';
import { ProductionFlightsTableContainer } from '@/modules/admin/payable/modules/productions/containers/ProductionFlightsTableContainer';
import { SearchParams } from '@/server/types/params';
import { PaymentType } from '@/server/types/payable';
import { FC } from 'react';
import { PayableProductionBillingPayment } from './PayableProductionBillingPayment';
import { PayableProductionCollectionPayment } from './PayableProductionCollectionPayment';

type PayableProductionTableSectionProps = {
  paymentType: PaymentType;
  searchParams: SearchParams;
};

export const PayableProductionTableSection: FC<
  PayableProductionTableSectionProps
> = ({ paymentType, searchParams }) => {
  return paymentType === 'billing' ? (
    <PayableProductionBillingPayment searchParams={searchParams} />
  ) : (
    <PayableProductionCollectionPayment>
      {searchParams.table === 'expenses' ? (
        <ProductionExpensesTableContainer searchParams={searchParams} />
      ) : (
        <ProductionFlightsTableContainer searchParams={searchParams} />
      )}
    </PayableProductionCollectionPayment>
  );
};
