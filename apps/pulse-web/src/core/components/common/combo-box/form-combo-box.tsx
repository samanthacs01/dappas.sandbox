import { FC, useMemo } from 'react';
import { ComboBox, ComboBoxProps } from '.';

type FormComboBoxProps = ComboBoxProps;

export const FormComboBox: FC<FormComboBoxProps> = ({
  search,
  defaultValue,
  options,
  ...rest
}) => {
  const { calculatedValue, calculatedSearch } = useMemo(() => {
    const selectedOption = options.find((opt) => opt.value === defaultValue);
    if (selectedOption) {
      return {
        calculatedValue: selectedOption.value,
        calculatedSearch: '',
      };
    } else {
      return {
        calculatedValue: '',
        calculatedSearch: defaultValue,
      };
    }
  }, [defaultValue, options]);

  return (
    <ComboBox
      {...{
        search: calculatedSearch,
        defaultValue: calculatedValue,
        options,
        ...rest,
      }}
    />
  );
};
