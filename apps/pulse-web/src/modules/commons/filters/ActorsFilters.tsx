import {
  ComboBoxMultiselect,
  ComboBox,
} from '@/core/components/common/combo-box';
import { getUsers } from '@/server/services/users';
import type { ComboBoxOption } from '@/server/types/combo-box';
import type { FiltersProps } from '@/server/types/filter';
import React, { type FC, useEffect, useState } from 'react';

const ActorsFilters: FC<FiltersProps> = ({
  multiple,
  defaultValue,
  onSelect,
}) => {
  const [options, setOptions] = useState<ComboBoxOption[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers({ page: 0 });
    if (data) {
      const items: ComboBoxOption[] = data.items.map((item) => ({
        label: item.first_name + ' ' + item.last_name,
        value: item.email,
      }));
      setOptions(items);
    }
  };

  return multiple ? (
    <ComboBoxMultiselect
      className="w-52"
      placeholder="Actors"
      options={options}
      id="actors"
      onSelect={onSelect}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
    />
  ) : (
    <ComboBox
      className="w-52"
      placeholder="Actors"
      options={options}
      id="actors"
      onSelect={onSelect}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
    />
  );
};

export default ActorsFilters;
