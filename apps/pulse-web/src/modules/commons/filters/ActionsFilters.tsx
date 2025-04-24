'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { cn } from '@/core/lib/utils';
import { logsActions } from '@/server/services/__mock/logs';
import { ComboBoxOption } from '@/server/types/combo-box';

type Props = {
  defaultValue: string | string[];
  onSelect: (id: string, value: string | string[]) => void;
  statuses?: ComboBoxOption[];
  multiple?: boolean;
  className?: string;
};

const ActionsFilter: React.FC<Props> = ({
  defaultValue,
  onSelect,
  statuses = logsActions,
  multiple,
  className,
}) => {
  return multiple ? (
    <ComboBoxMultiselect
      className={cn('w-32', className)}
      placeholder="Actions"
      options={statuses}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
      id="actions"
      onSelect={onSelect}
    />
  ) : (
    <ComboBox
      className={cn('w-32', className)}
      placeholder="Actions"
      options={statuses}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
      id="actions"
      onSelect={onSelect}
    />
  );
};

export default ActionsFilter;
