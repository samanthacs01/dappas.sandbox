import { Pagination } from '@/core/components/common/pagination/app-pagination';
import useUrlParams from '@/core/hooks/use-url-params';
import { Pagination as PaginationType } from '@/server/types/pagination';

type PaginationProps = {
  pagination: PaginationType;
};

export const TablePagination: React.FC<PaginationProps> = ({
  pagination: { page, per_page, total },
}) => {
  const { updateSearchParams } = useUrlParams();

  const onNext = () => {
    updateSearchParams({
      page: {
        action: 'set',
        value: (page + 1).toString(),
      },
    });
  };

  const onPrev = () => {
    updateSearchParams({
      page: {
        action: 'set',
        value: (page - 1).toString(),
      },
    });
  };

  const setCurrentPage = (page: number) => {
    updateSearchParams({ page: { action: 'set', value: page.toString() } });
  };

  return (
    <Pagination
      currentPage={page}
      totalPages={Math.ceil(total / per_page)}
      onNextPage={onNext}
      onPreviousPage={onPrev}
      onPageChange={(page) => setCurrentPage(page)}
    />
  );
};
