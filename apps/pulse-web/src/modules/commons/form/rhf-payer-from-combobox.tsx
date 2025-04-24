import RHFFromCombobox, { RHFFromComboboxProps } from '@/core/components/common/form-inputs/rhf-from-combobox';
import { getPayersNomenclator } from '@/server/services/nomenclator';
import { ComboBoxOption } from '@/server/types/combo-box';
import { FC, useEffect, useState } from 'react';

export const RHFPayerFromCombobox: FC<Omit<RHFFromComboboxProps, 'options'>> = (
  props,
) => {
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
  return <RHFFromCombobox {...{ ...props, options }} />;
};
