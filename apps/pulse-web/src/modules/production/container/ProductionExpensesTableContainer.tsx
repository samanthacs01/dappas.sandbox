import { defaultPagination } from '@/core/lib/pagination';
import { getProductionExpenses } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { FC } from 'react';
import { ProductionExpensesTable } from '../components/production-bills-details/production-expenses-table/ProductionExpensesTable';

type Props = {
  searchParams: SearchParams;
};

export const ProductionExpensesTableContainer: FC<Props> = async ({
  searchParams,
}) => {
  const { data } = await getProductionExpenses(searchParams);

  return (
    <ProductionExpensesTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
