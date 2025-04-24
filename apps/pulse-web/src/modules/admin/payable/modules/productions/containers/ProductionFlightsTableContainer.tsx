'use server';
import { defaultPagination } from '@/core/lib/pagination';
import { getProductionFlights } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { FC } from 'react';
import { ProductionFlightsTable } from '../components/details/bills/production-flights-table/ProductionFlightsTable';

type ProductionFlightsTableContainerPros = {
  searchParams: SearchParams;
};

export const ProductionFlightsTableContainer: FC<
  ProductionFlightsTableContainerPros
> = async ({ searchParams }) => {
  const { data } = await getProductionFlights(searchParams);

  return (
    <ProductionFlightsTable
      data={data?.items ?? []}
      pagination={data?.pagination ?? defaultPagination}
    />
  );
};
