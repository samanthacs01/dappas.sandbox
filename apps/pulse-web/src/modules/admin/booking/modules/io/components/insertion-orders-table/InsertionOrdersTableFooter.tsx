import { FunctionComponent } from 'react';
import { Pagination } from '@/server/types/pagination';
import { InsertionOrdersTablePagination } from './InsertionOrdersTablePagination';

type InsertionOrdersTableFooterProps = {
  pagination: Pagination;
};

export const InsertionOrdersTableFooter: FunctionComponent<
  InsertionOrdersTableFooterProps
> = ({ pagination }) => {
  return (
    <div className="flex justify-end w-full">
      <div>
        <InsertionOrdersTablePagination pagination={pagination} />
      </div>
    </div>
  );
};
