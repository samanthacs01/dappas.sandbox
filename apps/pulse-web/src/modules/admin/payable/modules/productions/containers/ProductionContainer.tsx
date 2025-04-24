import { getPayableProductions } from '@/server/services/payable';
import { SearchParams } from '@/server/types/params';
import { FunctionComponent } from 'react';
import ProductionList from '../components/list/ProductionList';

type PayableProductionProps = {
  searchParams: SearchParams;
};

const PayableProductionContainer: FunctionComponent<
  PayableProductionProps
> = async ({ searchParams }) => {
  const { items, pagination } = await getPayableProductions(searchParams);
  return <ProductionList data={items} pagination={pagination} />;
};

export default PayableProductionContainer;
