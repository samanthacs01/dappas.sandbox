export type MenuItem = {
  label: string;
  id: string;
  onClick?: (id: string) => void;
};

export type MenuCategory = {
  title: string;
  items: MenuItem[];
};

export type MoreDropdownProps = {
  categories: MenuCategory[];
  buttonLabel?: string;
  className?: string;
  onItemClick?: (id: string) => void;
};
