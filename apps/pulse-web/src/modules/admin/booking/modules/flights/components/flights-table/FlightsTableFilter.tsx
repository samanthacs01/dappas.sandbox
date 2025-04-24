'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { flightsStatusFilters } from '@/modules/admin/booking/utils/data';
import AdvertiserFilter from '@/modules/commons/filters/AdvertiserFilter';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import PayerFilter from '@/modules/commons/filters/PayerFilter';
import ProductionFilter from '@/modules/commons/filters/ProductionFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { useSearchParams } from 'next/navigation';

const FlightsTableFilter = () => {
  const { updateFilter } = useUpdateFilters();

  const searchParams = useSearchParams();
  const payers = searchParams.getAll('payers');
  const status = searchParams.getAll('status');
  const productions = searchParams.getAll('productions');
  const advertisers = searchParams.getAll('advertisers');

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-4">
        <PayerFilter
          {...{ defaultValue: payers, onSelect: updateFilter, multiple: true }}
        />
        <StatusFilter
          {...{
            defaultValue: status,
            onSelect: updateFilter,
            statuses: flightsStatusFilters,
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
        <AdvertiserFilter
          {...{
            defaultValue: advertisers,
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

export default FlightsTableFilter;
