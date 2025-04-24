import useUpdateFilters from '@/core/hooks/use-update-filters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import RoleFilter from '@/modules/commons/filters/RoleFilter';
import SearchFilter from '@/modules/commons/filters/SearchFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { userStatus } from '@/server/services/__mock/users';
import { useSearchParams } from 'next/navigation';

const UserManagementTableFilters = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const role = searchParams.getAll('role');
  const status = searchParams.getAll('status');
  const { updateFilter } = useUpdateFilters();

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4">
        <SearchFilter
          {...{
            value: q ?? '',
            onChange: (value) => updateFilter('q', value, 'set'),
            placeholder: 'Search by name or email...',
          }}
        />
        <RoleFilter
          {...{ defaultValue: role, onSelect: updateFilter, multiple: true }}
        />
        <StatusFilter
          {...{
            defaultValue: status,
            onSelect: updateFilter,
            statuses: userStatus,
            multiple: true,
          }}
        />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default UserManagementTableFilters;
