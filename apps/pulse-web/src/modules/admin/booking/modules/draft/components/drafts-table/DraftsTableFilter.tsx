'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { draftsStatusFilters } from '@/modules/admin/booking/utils/data';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { useSearchParams } from 'next/navigation';

const DraftsTableFilter = () => {
  const { updateFilter } = useUpdateFilters();

  const params = useSearchParams();
  const status = params.getAll('status');

  return (
    <div className="flex gap-4">
      <StatusFilter
        defaultValue={status}
        onSelect={updateFilter}
        statuses={draftsStatusFilters}
        multiple
        data-cy="drafts-table-status-filter"
      />
    </div>
  );
};

export default DraftsTableFilter;
