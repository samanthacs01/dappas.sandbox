'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { payableProductionBillStatus } from '@/modules/admin/payable/libs/utils/payableProductionBillStatus';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';
import PayerFilter from '@/modules/commons/filters/PayerFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { useSearchParams } from 'next/navigation';

const ProductionFlightsTableFilter = () => {
  const { updateFilter } = useUpdateFilters();

  const searchParams = useSearchParams();
  const payers = searchParams.getAll('payers');
  const status = searchParams.getAll('status');

  return (
    <div className="flex gap-4">
      <PayerFilter
        {...{
          defaultValue: payers,
          onSelect: updateFilter,
          multiple: true,
          className: 'bg-card',
        }}
      />
      <StatusFilter
        {...{
          defaultValue: status,
          onSelect: updateFilter,
          statuses: payableProductionBillStatus,
          multiple: true,
          className: 'bg-card',
        }}
      />
      <DateRangeFilter />
    </div>
  );
};

export default ProductionFlightsTableFilter;
