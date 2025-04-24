'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import PayerFilter from '@/modules/commons/filters/PayerFilter';
import ProductionFilter from '@/modules/commons/filters/ProductionFilter';
import SearchFilter from '@/modules/commons/filters/SearchFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { useSearchParams } from 'next/navigation';
import { IOStatusFilters } from '../../../../utils/data';

const InsertionOrdersTableFilter = () => {
  const { updateFilter } = useUpdateFilters();

  const params = useSearchParams();

  const payers = params.getAll('payers');
  const q = params.get('q');
  const productions = params.getAll('productions');
  const status = params.getAll('status');

  return (
    <div className="flex justify-between w-full">
      <div className="w-full flex gap-4">
        <SearchFilter
          onChange={(value) => updateFilter('q', value, 'set')}
          value={q ?? ''}
        />
        <PayerFilter
          {...{
            defaultValue: payers,
            onSelect: updateFilter,
            multiple: true,
          }}
        />
        <StatusFilter
          {...{
            defaultValue: status,
            onSelect: updateFilter,
            statuses: IOStatusFilters,
            multiple: true,
          }}
        />
        <ProductionFilter
          {...{
            defaultValue: productions,
            onSelect: updateFilter,
            multiple: true,
          }}
        />
        <DateRangeFilter />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default InsertionOrdersTableFilter;
