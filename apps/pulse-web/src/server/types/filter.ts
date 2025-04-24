export type FiltersProps = {
  defaultValue: string | string[];
  onSelect: (id: string, value: string | string[]) => void;
  multiple?: boolean;
  className?: string
};
