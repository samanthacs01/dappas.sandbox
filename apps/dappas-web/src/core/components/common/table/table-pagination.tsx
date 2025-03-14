import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCNPagination,
} from '@/core/components/ui/pagination';
import { FunctionComponent } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageChange: (page: number) => void;
}

export const TablePagination: FunctionComponent<PaginationProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    let startPage: number;
    let endPage: number;

    if (currentPage === 1) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    const items = [];
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            aria-current={i === currentPage ? 'page' : undefined}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return items;
  };

  return (
    <ShadCNPagination className="justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={currentPage > 1 ? onPreviousPage : undefined}
            aria-disabled={currentPage === 1}
            data-cy="pagination-previous"
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            onClick={currentPage < totalPages ? onNextPage : undefined}
            aria-disabled={currentPage === totalPages}
            data-cy="pagination-next"
          />
        </PaginationItem>
      </PaginationContent>
    </ShadCNPagination>
  );
};
