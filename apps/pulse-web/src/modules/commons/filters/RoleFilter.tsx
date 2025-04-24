'use client';

import { ComboBox } from '@/core/components/common/combo-box';
import { ComboBoxMultiselect } from '@/core/components/common/combo-box/combo-box-multiselect';
import { userRoles } from '@/server/services/__mock/users';
import { ComboBoxOption } from '@/server/types/combo-box';

type Props = {
  defaultValue: string | string[];
  onSelect: (id: string, value: string | string[]) => void;
  statuses?: ComboBoxOption[];
  multiple?: boolean;
};

const RoleFilter: React.FC<Props> = ({
  defaultValue,
  onSelect,
  statuses = userRoles,
  multiple,
}) => {
  return multiple ? (
    <ComboBoxMultiselect
      className="w-32"
      placeholder="Role"
      options={statuses}
      defaultValue={
        typeof defaultValue === 'string' ? [defaultValue] : defaultValue
      }
      id="role"
      onSelect={onSelect}
    />
  ) : (
    <ComboBox
      className="w-32"
      placeholder="Role"
      options={statuses}
      defaultValue={typeof defaultValue === 'string' ? defaultValue : ''}
      id="role"
      onSelect={onSelect}
    />
  );
};

export default RoleFilter;
