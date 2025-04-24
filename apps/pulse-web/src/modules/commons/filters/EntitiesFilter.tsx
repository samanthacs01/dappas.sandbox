'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { cn } from '@/core/lib/utils';
import { entitiesData } from '@/server/services/__mock/logs';
import { ComboBoxOption } from '@/server/types/combo-box';

type Props = {
  defaultValue: string | string[];
  onSelect: (id: string, value: string | string[]) => void;
  entities?: ComboBoxOption[];
  multiple?: boolean;
  className?: string;
};

const EntitiesFilter: React.FC<Props> = ({
  defaultValue,
  onSelect,
  entities = entitiesData,
  multiple,
  className,
}) => {
  return multiple ? (
    <ComboBoxMultiselect
      className={cn('w-40', className)}
      placeholder="Entity"
      options={entities}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
      id="entities"
      onSelect={onSelect}
    />
  ) : (
    <ComboBox
      className={cn('w-40', className)}
      placeholder="Entity"
      options={entities}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
      id="entities"
      onSelect={onSelect}
    />
  );
};

export default EntitiesFilter;
