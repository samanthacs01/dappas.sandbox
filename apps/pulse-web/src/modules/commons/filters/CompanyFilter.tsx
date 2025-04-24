'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { getAdminCompanyNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { FiltersProps } from '@/server/types/filter';
import { useEffect, useState } from 'react';

const CompanyFilter: React.FC<FiltersProps> = ({
  defaultValue,
  onSelect,
  multiple,
}) => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    const data = await getAdminCompanyNomenclator();
    if (data.items) {
      setOptions(data.items);
    }
  };

  return multiple ? (
    <ComboBoxMultiselect
      placeholder="Company"
      options={options}
      id="companies"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      placeholder="Company"
      options={options}
      id="companies"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default CompanyFilter;
