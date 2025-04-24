'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import ProductionFilter from '@/modules/commons/filters/ProductionFilter';
import RemainingMonthsFilter from '@/modules/commons/filters/RemainingMonthsFilter';
import { useSearchParams } from 'next/navigation';

const ExpensesTableFilters = () => {
  const searchParams = useSearchParams();
  const productions = searchParams.getAll('productions');
  const months = searchParams.getAll('months');
  const { updateFilter } = useUpdateFilters();

  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-4">
        <RemainingMonthsFilter
          {...{ defaultValue: months, onSelect: updateFilter, multiple: true }}
        />
        <ProductionFilter
          {...{
            defaultValue: productions,
            onSelect: updateFilter,
            multiple: true,
          }}
        />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default ExpensesTableFilters;
