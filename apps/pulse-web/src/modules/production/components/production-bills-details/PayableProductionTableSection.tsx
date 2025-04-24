import { SearchParams } from '@/server/types/params';
import { PaymentType } from '@/server/types/payable';
import { FC } from 'react';
import { ProductionExpensesTableContainer } from '../../container/ProductionExpensesTableContainer';
import { ProductionFlightsTableContainer } from '../../container/ProductionFlightsTableContainer';
import { PayableProductionBillingPayment } from './PayableProductionBillingPayment';
import { PayableProductionCollectionPayment } from './PayableProductionCollectionPayment';

type PayableProductionTableSectionProps = {
  paymentType: PaymentType;
  activeTable: string;
  searchParams: SearchParams;
};

export const PayableProductionTableSection: FC<
  PayableProductionTableSectionProps
> = ({ paymentType, activeTable, searchParams }) => {
  return paymentType === 'billing' ? (
    <PayableProductionBillingPayment searchParams={searchParams} />
  ) : (
    <PayableProductionCollectionPayment>
      {activeTable === 'expenses' ? (
        <ProductionExpensesTableContainer searchParams={searchParams} />
      ) : (
        <ProductionFlightsTableContainer searchParams={searchParams} />
      )}
    </PayableProductionCollectionPayment>
  );
};
