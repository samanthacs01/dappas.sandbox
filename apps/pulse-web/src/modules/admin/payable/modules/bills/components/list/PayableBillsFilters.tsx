import useUpdateFilters from '@/core/hooks/use-update-filters';
import { CleanFiltersButton } from '@/modules/commons/filters/CleanFiltersButton';
import ProductionFilter from '@/modules/commons/filters/ProductionFilter';
import StatusFilter from '@/modules/commons/filters/StatusFilter';
import { payableBillsStatus } from '@/server/services/__mock/payable';
import { useSearchParams } from 'next/navigation';

const PayableBillsFilters = () => {
  const searchParams = useSearchParams();
  const productions = searchParams.getAll('productions');
  const status = searchParams.getAll('status');
  const { updateFilter } = useUpdateFilters();

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-4">
        <ProductionFilter
          {...{
            defaultValue: productions,
            onSelect: updateFilter,
            multiple: true,
          }}
        />
        <StatusFilter
          {...{
            defaultValue: status,
            onSelect: updateFilter,
            statuses: payableBillsStatus,
            multiple: true,
          }}
        />
      </div>
      <CleanFiltersButton expanded />
    </div>
  );
};

export default PayableBillsFilters;
