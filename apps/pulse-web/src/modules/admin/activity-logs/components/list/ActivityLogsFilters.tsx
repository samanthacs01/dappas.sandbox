import useUpdateFilters from '@/core/hooks/use-update-filters';
import ActionsFilter from '@/modules/commons/filters/ActionsFilters';
import ActorsFilters from '@/modules/commons/filters/ActorsFilters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import EntitiesFilter from '@/modules/commons/filters/EntitiesFilter';
import SearchFilter from '@/modules/commons/filters/SearchFilter';
import { useSearchParams } from 'next/navigation';

const ActivityLogsFilters = () => {
  const { updateFilter } = useUpdateFilters();
  const params = useSearchParams();

  const q = params.get('q');
  const action = params.getAll('actions');
  const user = params.getAll('actors');
  const entities = params.getAll('entities');

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4">
        <SearchFilter
          onChange={(value) => updateFilter('q', value, 'set')}
          value={q ?? ''}
          placeholder="Search..."
        />
        <DateRangeFilter />
        <ActorsFilters onSelect={updateFilter} defaultValue={user} multiple />
        <ActionsFilter onSelect={updateFilter} defaultValue={action} multiple />
        <EntitiesFilter
          multiple
          onSelect={updateFilter}
          defaultValue={entities}
        />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default ActivityLogsFilters;
