'use client';
import useUpdateFilters from '@/core/hooks/use-update-filters';
import { payableProductionBillStatus } from '@/modules/admin/payable/libs/utils/payableProductionBillStatus';
import RemainingMonthsFilter from '@/modules/commons/filters/RemainingMonthsFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { useSearchParams } from 'next/navigation';

const ProductionBillingTableFilter = () => {
  const { updateFilter } = useUpdateFilters();

  const searchParams = useSearchParams();
  const month = searchParams.getAll('months');
  const status = searchParams.getAll('status');

  return (
    <div className="flex gap-4">
      <RemainingMonthsFilter
        {...{
          defaultValue: month,
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
    </div>
  );
};

export default ProductionBillingTableFilter;
