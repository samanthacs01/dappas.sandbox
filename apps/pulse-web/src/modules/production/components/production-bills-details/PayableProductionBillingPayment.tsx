import { ProductionBillingTable } from './production-bills-table/ProductionBillingTable';
import { getProductionBills } from '@/server/services/payable';
import { FC } from 'react';
import { defaultPagination } from '@/core/lib/pagination';
import { SearchParams } from '@/server/types/params';

type Props = {
  searchParams: SearchParams;
};

export const PayableProductionBillingPayment: FC<Props> = async ({
  searchParams,
}) => {
  const { data } = await getProductionBills(searchParams);

  return (
    <ProductionBillingTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
