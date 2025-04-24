'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { getProductionsNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { FiltersProps } from '@/server/types/filter';
import { useEffect, useState } from 'react';

const ProductionFilter: React.FC<FiltersProps> = ({
  defaultValue,
  onSelect,
  multiple,
}) => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);

  useEffect(() => {
    getProductions();
  }, []);

  const getProductions = async () => {
    const data = await getProductionsNomenclator();
    if (data) {
      setOptions(data);
    }
  };

  return multiple ? (
    <ComboBoxMultiselect
      className="w-36"
      placeholder="Production"
      options={options}
      id="productions"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      className="w-36"
      placeholder="Production"
      options={options}
      id="productions"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default ProductionFilter;
