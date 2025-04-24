'use client';
import DateRangeFilter from '@/modules/commons/filters/DateRangeFilter';

const ProductionExpensesTableFilter = () => {
  return (
    <div className="flex gap-4">
      <DateRangeFilter />
    </div>
  );
};

export default ProductionExpensesTableFilter;
