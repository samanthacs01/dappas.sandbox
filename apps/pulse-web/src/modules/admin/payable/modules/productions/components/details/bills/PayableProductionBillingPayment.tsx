import { ProductionBillingTable } from './production-bills-table/ProductionBillingTable';
import { FC } from 'react';
import { getProductionBills } from '@/server/services/payable';
import { defaultPagination } from '@/core/lib/pagination';
import { SearchParams } from '@/server/types/params';

type PayableProductionBillingPaymentProps = {
  searchParams: SearchParams;
};

export const PayableProductionBillingPayment: FC<
  PayableProductionBillingPaymentProps
> = async ({ searchParams }) => {
  const { data } = await getProductionBills(searchParams);

  return (
    <ProductionBillingTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
