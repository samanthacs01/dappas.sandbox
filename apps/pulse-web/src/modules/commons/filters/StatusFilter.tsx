'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { cn } from '@/core/lib/utils';
import { invoiceStatus } from '@/server/services/__mock/admin';
import { ComboBoxOption } from '@/server/types/combo-box';

type Props = {
  defaultValue: string | string[];
  onSelect: (id: string, value: string | string[]) => void;
  statuses?: ComboBoxOption[];
  multiple?: boolean;
  className?: string;
};

const StatusFilter: React.FC<Props> = ({
  defaultValue,
  onSelect,
  statuses = invoiceStatus,
  multiple,
  className,
}) => {
  return multiple ? (
    <ComboBoxMultiselect
      className={cn('w-32', className)}
      placeholder="Status"
      options={statuses}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
      id="status"
      onSelect={onSelect}
    />
  ) : (
    <ComboBox
      className={cn('w-32', className)}
      placeholder="Status"
      options={statuses}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
      id="status"
      onSelect={onSelect}
    />
  );
};

export default StatusFilter;
