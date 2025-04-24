'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { cn } from '@/core/lib/utils';
import { getPayersNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { FiltersProps } from '@/server/types/filter';
import { FC, useEffect, useState } from 'react';

const PayerFilter: FC<FiltersProps> = ({
  defaultValue,
  onSelect,
  multiple,
  className,
}) => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);

  useEffect(() => {
    getPayers();
  }, []);

  const getPayers = async () => {
    const data = await getPayersNomenclator();
    if (data) {
      setOptions(data);
    }
  };

  return multiple ? (
    <ComboBoxMultiselect
      className={cn('w-36', className)}
      placeholder="Payer"
      options={options}
      id="payers"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      className={cn('w-36', className)}
      placeholder="Payer"
      options={options}
      id="payers"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default PayerFilter;
