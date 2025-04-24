'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { getAllMonths } from '@/core/lib/date';
import { cn } from '@/core/lib/utils';
import { FiltersProps } from '@/server/types/filter';

const RemainingMonthsFilter: React.FC<FiltersProps> = ({
  defaultValue,
  onSelect,
  multiple,
  className,
}) => {
  return multiple ? (
    <ComboBoxMultiselect
      className={cn('w-36', className)}
      placeholder="Month"
      options={getAllMonths()}
      id="months"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      className={cn('w-36', className)}
      placeholder="Month"
      options={getAllMonths()}
      id="months"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default RemainingMonthsFilter;
