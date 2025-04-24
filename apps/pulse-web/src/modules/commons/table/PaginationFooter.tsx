import { Pagination } from '@/server/types/pagination';
import { FunctionComponent } from 'react';
import { TablePagination } from './Pagination';

type PaginationTableFooterProps = {
  pagination: Pagination;
};

export const TablePaginationFooter: FunctionComponent<
  PaginationTableFooterProps
> = ({ pagination }) => {
  return (
    <div className="flex justify-end w-full">
      <TablePagination pagination={pagination} />
    </div>
  );
};
