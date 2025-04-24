'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import PayerFilter from '@/modules/commons/filters/PayerFilter';
import ProductionFilter from '@/modules/commons/filters/ProductionFilter';
import SearchFilter from '@/modules/commons/filters/SearchFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { ComboBoxOption } from '@/server/types/combo-box';
import { useSearchParams } from 'next/navigation';

const statuses: ComboBoxOption[] = [
  {
    label: 'Pending Payment',
    value: 'pending_payment',
  },
  {
    label: 'Paid',
    value: 'paid',
  },
  {
    label: 'Partially Paid',
    value: 'partial_paid',
  },
];

const ReceivablesInvoicesFilters = () => {
  const searchParams = useSearchParams();
  const payers = searchParams.getAll('payers');
  const productions = searchParams.getAll('productions');
  const status = searchParams.getAll('status');
  const q = searchParams.get('q');
  const { updateFilter } = useUpdateFilters();

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-6">
        <SearchFilter
          {...{
            onChange: (value) => updateFilter('q', value, 'set'),
            value: q ?? '',
          }}
          placeholder="Invoice..."
          className="w-full max-w-md"
        />
        <PayerFilter
          {...{ defaultValue: payers, onSelect: updateFilter, multiple: true }}
        />
        <ProductionFilter
          {...{
            onSelect: updateFilter,
            defaultValue: productions,
            multiple: true,
          }}
        />
        <StatusFilter
          {...{
            onSelect: updateFilter,
            defaultValue: status,
            multiple: true,
            statuses,
          }}
        />
        <DateRangeFilter />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default ReceivablesInvoicesFilters;
