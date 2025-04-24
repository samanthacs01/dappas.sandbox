'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { getAdminAdvertisersNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { FiltersProps } from '@/server/types/filter';
import { useEffect, useState } from 'react';

const AdvertiserFilter: React.FC<FiltersProps> = ({
  defaultValue,
  onSelect,
  multiple,
}) => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);

  useEffect(() => {
    getAdvertisers();
  }, []);

  const getAdvertisers = async () => {
    const data = await getAdminAdvertisersNomenclator();
    if (data) {
      setOptions(data);
    }
  };

  return multiple ? (
    <ComboBoxMultiselect
      placeholder="Advertiser"
      options={options}
      id="advertisers"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      placeholder="Advertiser"
      options={options}
      id="advertisers"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default AdvertiserFilter;
