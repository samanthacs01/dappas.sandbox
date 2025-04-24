import { defaultPagination } from '@/core/lib/pagination';
import { getProductionFlights } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { FC } from 'react';
import { ProductionFlightsTable } from '../components/production-bills-details/production-flights-table/ProductionFlightsTable';

type Props = {
  searchParams: SearchParams;
};

export const ProductionFlightsTableContainer: FC<Props> = async ({
  searchParams,
}) => {
  const { data } = await getProductionFlights(searchParams);

  return (
    <ProductionFlightsTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
