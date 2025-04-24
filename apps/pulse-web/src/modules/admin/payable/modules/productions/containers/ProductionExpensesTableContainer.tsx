import { defaultPagination } from '@/core/lib/pagination';
import { getProductionExpenses } from '@/server/services/payable';
import { FC } from 'react';

import { SearchParams } from '@/server/types/params';
import { ProductionExpensesTable } from '../components/details/bills/production-expenses-table/ProductionExpensesTable';

type ProductionExpensesTableContainerProps = {
  searchParams: SearchParams;
};

export const ProductionExpensesTableContainer: FC<
  ProductionExpensesTableContainerProps
> = async ({ searchParams }) => {
  const { data } = await getProductionExpenses(searchParams);

  return (
    <ProductionExpensesTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
