import { Skeleton } from '@/core/components/ui/skeleton';
import TableSkeletons from './table-skeletons';

type Props = {
  filters?: number;
  rows?: number;
  columns?: number;
};

const TableSkeletonFilters: React.FC<Props> = ({
  columns = 7,
  filters = 3,
  rows = 10,
}) => {
  return (
    <div className="flex flex-col justify-start items-start gap-4">
      <div className="flex gap-2">
        {[...Array(filters)].map((_, index) => (
          <Skeleton key={`${index}-skeleton-filter`} className="h-8 w-32" />
        ))}
      </div>
      <TableSkeletons columns={columns} rows={rows} />
    </div>
  );
};

export default TableSkeletonFilters;
